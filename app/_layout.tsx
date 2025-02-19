import { Stack } from "expo-router";
import {StatusBar} from 'expo-status-bar';
import React from "react";

export default function RootLayout() {
  return (
    <>
    <Stack>
      <Stack.Screen 
      name="(tabs)"  
      options={{ headerShown:false }}
      />
      <Stack.Screen 
      name="+" 
      />
    </Stack>
    <StatusBar style="light" />
    </>
  );
}
