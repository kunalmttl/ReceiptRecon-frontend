import { Stack } from 'expo-router';

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hide here too so product handles its own
      }}
    />
  );
}
