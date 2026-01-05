import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="orders" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="add-address" />
      <Stack.Screen name="edit-address" />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="notification-settings" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="help" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}
