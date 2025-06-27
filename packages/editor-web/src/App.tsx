import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';
import { api } from './supabaseClient';
import Editor from './Editor';
import { ReactFlowProvider } from 'reactflow';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    api.client.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = api.client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Auth supabaseClient={api.client} appearance={{ theme: ThemeSupa }} />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <Editor />
    </ReactFlowProvider>
  );
}
