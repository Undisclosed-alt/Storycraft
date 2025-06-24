import React, { useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import NodeView from './NodeView';
import { useStory } from './StoryContext';

type RootStackParamList = {
  node: { id: string };
};

type Props = StackScreenProps<RootStackParamList, 'node'>;

export default function NodeScreen({ route, navigation }: Props) {
  const { story, setCurrentId } = useStory();
  const nodeId = route.params.id;

  useEffect(() => {
    setCurrentId(nodeId);
  }, [nodeId]);

  if (!story) return null;
  const node = story.nodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const handleAction = (target: string) => {
    navigation.push('node', { id: target });
  };

  const handleRestart = () => {
    const first = story.nodes[0]?.id;
    if (first) {
      navigation.reset({ index: 0, routes: [{ name: 'node', params: { id: first } }] });
    }
  };

  return <NodeView node={node} onAction={handleAction} onRestart={handleRestart} />;
}
