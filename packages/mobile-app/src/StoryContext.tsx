import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export interface StoryNode {
  id: string;
  text: string;
  image: string;
  actions: { id: string; label: string; target: string }[];
}

export interface StoryData {
  id: string;
  nodes: StoryNode[];
}

interface StoryContextType {
  story: StoryData | null;
  setStory: (s: StoryData) => void;
  currentId: string | null;
  setCurrentId: (id: string) => void;
  history: string[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const StoryContext = createContext<StoryContextType | undefined>(undefined);

export const useStory = () => {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('StoryContext not found');
  return ctx;
};

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [story, setStory] = useState<StoryData | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('theme');
      if (t === 'dark') setTheme('dark');
    })();
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    await AsyncStorage.setItem('theme', next);
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('progress');
      if (saved) setCurrentId(saved);
      const hist = await AsyncStorage.getItem('history');
      if (hist) setHistory(JSON.parse(hist));
    })();
  }, []);

  const setCurrent = async (id: string) => {
    setCurrentId(id);
    setHistory((h) => {
      const next = [...h, id];
      AsyncStorage.setItem('history', JSON.stringify(next));
      return next;
    });
    await AsyncStorage.setItem('progress', id);
  };

  return (
    <StoryContext.Provider value={{ story, setStory, currentId, setCurrentId: setCurrent, history, theme, toggleTheme }}>
      <PaperProvider theme={theme === 'light' ? MD3LightTheme : MD3DarkTheme}>{children}</PaperProvider>
    </StoryContext.Provider>
  );
}

export async function loadStory(url: string, fallback?: StoryData): Promise<StoryData> {
  const cachePath = FileSystem.cacheDirectory + encodeURIComponent(url);
  try {
    const info = await FileSystem.getInfoAsync(cachePath);
    if (info.exists) {
      const data = await FileSystem.readAsStringAsync(cachePath);
      return JSON.parse(data);
    }
  } catch {}
  try {
    const res = await fetch(url);
    const json = await res.json();
    await FileSystem.writeAsStringAsync(cachePath, JSON.stringify(json));
    return json;
  } catch {
    if (fallback) return fallback;
    throw new Error('Failed to load story');
  }
}
