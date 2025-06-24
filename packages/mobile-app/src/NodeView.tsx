import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { StoryNode } from './StoryContext';

interface Props {
  node: StoryNode;
  onAction: (target: string) => void;
  onRestart: () => void;
}

export default function NodeView({ node, onAction, onRestart }: Props) {

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
          <Button key={a.id} mode="contained" onPress={() => onAction(a.target)}>
            {a.label}
          </Button>
        ))}
        <Button mode="outlined" onPress={onRestart}>
          Restart Story
        </Button>
      </View>
    </ScrollView>
  );
}
