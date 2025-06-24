import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StoryProvider, useStory } from './StoryContext';
import StoryLoader from './StoryLoader';
import NodeScreen from './NodeScreen';
import { Button } from 'react-native-paper';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

function Navigator() {
  const { toggleTheme } = useStory();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="loader" options={{ headerShown: false }}>
          {({ navigation }) => (
            <StoryLoader
              url={
                `${
                  process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL ??
                  'https://pcfjkrdpdzwcvwupueen.supabase.co/storage/v1/object/public/exports'
                }/demo-story/story.json`
              }
              onLoaded={(firstId) => navigation.replace('node', { id: firstId })}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="node"
          options={{
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <Button onPress={toggleTheme}>Theme</Button>
              </View>
            ),
          }}
          component={NodeScreen}
        />
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
