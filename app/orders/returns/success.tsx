import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function SuccessScreen() {
  const { qr_string } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>✅ Verified Product</Text>
      <Text style={styles.subtext}>Scan this QR code at Express Return Counter</Text>

      <View style={{ marginVertical: 30 }}>
        <QRCode value={qr_string as string} size={200} />
      </View>

      <Text style={{ fontSize: 12, color: '#888' }}>Payload: {qr_string}</Text>

      <Button title="Back to Orders" onPress={() => router.push('/orders')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtext: { fontSize: 14, color: '#555', textAlign: 'center' },
});
