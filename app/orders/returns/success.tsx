import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { saveQRString } from '@/store/asyncStore';

export default function SuccessScreen() {
  const { qr_string, PRODUCT_ID } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    saveQRString(qr_string as string, PRODUCT_ID as string);
    console.log("qr is ", qr_string);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>✅ Product Verified</Text>
      <Text style={styles.subtext}>
        Show this QR code at the Express Return Counter
      </Text>

      <View style={styles.qrWrapper}>
        <QRCode value={qr_string as string} size={220} />
      </View>

      <Text style={styles.payload}>Payload: {qr_string}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/orders')}
      >
        <Text style={styles.buttonText}>Back to My Orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2e7d32',
  },
  subtext: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  payload: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 12,
  },
  button: {
    backgroundColor: '#0071ce',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
