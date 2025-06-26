import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SuccessScreen() {
  const { productId } = useLocalSearchParams();
  const router = useRouter();

  // 🔐 Generate a unique string (can also include user ID, timestamp, etc.)
  const qrPayload = `return:${productId}-${Date.now()}`;

  // 📨 Send QR string to backend for logging
  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/createQR`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ qr_string: qrPayload,user: "685d095991e761cd0ee17f2a", product_id: productId }),
    }).catch(() => {
      Alert.alert('⚠️ Error', 'Failed to notify backend');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>✅ Verified Product</Text>
      <Text style={styles.subtext}>Scan this QR code at Express Return Counter</Text>

      <View style={{ marginVertical: 30 }}>
        <QRCode value={qrPayload} size={200} />
      </View>

      <Text style={{ fontSize: 12, color: '#888' }}>Payload: {qrPayload}</Text>

      <Button title="Back to Orders" onPress={() => router.push('/orders')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtext: { fontSize: 14, color: '#555', textAlign: 'center' },
});
