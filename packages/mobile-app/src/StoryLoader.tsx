import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useStory, loadStory } from './StoryContext';
import bundled from '../assets/story.json';

interface Props {
  url: string;
  onLoaded: (firstId: string) => void;
}

export default function StoryLoader({ url, onLoaded }: Props) {
  const { setStory, setCurrentId } = useStory();

  useEffect(() => {
    (async () => {
      try {
        const data = await loadStory(url, bundled as any);
        setStory(data);
        const first = data.nodes[0]?.id ?? null;
        if (first) {
          setCurrentId(first);
          onLoaded(first);
        }
      } catch {}
    })();

    const unsub = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        loadStory(url, bundled as any).then((data) => setStory(data));
      }
    });

    return () => unsub();
  }, [url]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
