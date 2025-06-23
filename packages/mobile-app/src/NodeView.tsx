import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { useStory } from './StoryContext';

export default function NodeView() {
  const { story, currentId, setCurrentId } = useStory();
  if (!story || !currentId) return null;
  const node = story.nodes.find((n) => n.id === currentId);
  if (!node) return null;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {node.image ? (
        <FastImage
          source={{ uri: node.image }}
          style={{ width: '100%', height: 200, marginBottom: 16 }}
          resizeMode={FastImage.resizeMode.contain}
        />
      ) : null}
      <Text style={{ marginBottom: 16 }}>{node.text}</Text>
      <View style={{ gap: 8 }}>
        {node.actions.map((a) => (
          <Button key={a.id} mode="contained" onPress={() => setCurrentId(a.target)}>
            {a.label}
          </Button>
        ))}
        <Button mode="outlined" onPress={() => setCurrentId(story.nodes[0].id)}>
          Restart Story
        </Button>
      </View>
    </ScrollView>
  );
}
