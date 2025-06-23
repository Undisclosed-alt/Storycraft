import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StoryProvider, useStory } from './StoryContext';
import StoryLoader from './StoryLoader';
import NodeView from './NodeView';
import { Button } from 'react-native-paper';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

function Navigator() {
  const { story, currentId, toggleTheme } = useStory();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!story ? (
          <Stack.Screen name="loader" options={{ headerShown: false }}>
            {() => <StoryLoader url="https://pcfjkrdpdzwcvwupueen.supabase.co/storage/v1/object/public/exports/demo-story/story.json" />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="node"
            options={{
              headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                  <Button onPress={toggleTheme}>Theme</Button>
                </View>
              ),
            }}
          >
            {() => <NodeView />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
      <StatusBar />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <StoryProvider>
      <Navigator />
    </StoryProvider>
  );
}
