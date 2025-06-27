import { useState } from 'react';
import { api } from './supabaseClient';

export default function ImageUpload({
  nodeId,
  onUrl,
}: {
  nodeId: string;
  onUrl: (url: string) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) {
      setError('File too large');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Invalid file type');
      return;
    }
    setError(null);
    const path = `${nodeId}/${Date.now()}-${file.name}`;
    setProgress(50);
    const { error: uploadError } = await api.client.storage
      .from('images')
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setError(uploadError.message);
      setProgress(0);
      return;
    }
    setProgress(100);
    const { data } = api.client.storage.from('images').getPublicUrl(path);
    onUrl(data.publicUrl);
  };

  return (
    <div className="space-y-1">
      <input type="file" accept="image/*" onChange={handleChange} />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {progress > 0 && progress < 100 && (
        <progress value={progress} max={100} className="w-full" />
      )}
    </div>
  );
}
