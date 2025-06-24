import React, { useEffect, useState } from 'react';
import { ReactFlowProvider, createReactFlowStore } from 'reactflow';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import Editor from './Editor';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  // isolated store → multiple independent flows possible
  const store = React.useMemo(() => createReactFlowStore(), []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    );
  }

  return (
    <ReactFlowProvider store={store}>
      <Editor />
    </ReactFlowProvider>
  );
}
