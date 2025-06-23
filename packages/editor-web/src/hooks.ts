import { useCallback } from 'react';
import { supabase } from './supabaseClient';
import { Node } from 'reactflow';

export function useNodeApi() {
  const loadNodes = useCallback(async (): Promise<Node[]> => {
    const { data } = await supabase.from('nodes').select('id, text, image_url');
    return (
      data?.map((n: any, idx: number) => ({
        id: n.id,
        position: { x: idx * 100, y: idx * 80 },
        data: { label: n.text, image: n.image_url },
      })) || []
    );
  }, []);

  const saveNodes = useCallback(async (nodes: Node[]) => {
    await supabase.from('nodes').upsert(
      nodes.map((n) => ({
        id: n.id,
        text: (n.data as any).label,
        image_url: (n.data as any).image,
      }))
    );
  }, []);

  const snapshotRevision = useCallback(
    async (storyId: string, nodes: Node[]) => {
      await supabase.from('revisions').insert({
        id: crypto.randomUUID(),
        story_id: storyId,
        data: nodes.map((n) => ({
          id: n.id,
          text: (n.data as any).label,
          image_url: (n.data as any).image,
        })),
      });
    },
    []
  );

  return { loadNodes, saveNodes, snapshotRevision };
}
