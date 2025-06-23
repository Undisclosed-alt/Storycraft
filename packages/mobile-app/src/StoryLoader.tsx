import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useStory, loadStory } from './StoryContext';

export default function StoryLoader({ url }: { url: string }) {
  const { setStory, setCurrentId } = useStory();

  useEffect(() => {
    (async () => {
      const data = await loadStory(url);
      setStory(data);
      setCurrentId(data.nodes[0]?.id ?? null);
    })();
  }, [url]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
