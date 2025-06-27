import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Button, StyleSheet, Alert } from 'react-native';
import { Camera,CameraView } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CaptureScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [Base64ImageString, setBase64ImageString] = useState(null);
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const { ORDER_ID,reason, PRODUCT_ID } = useLocalSearchParams();


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({base64: true});
      setPhotoUri(photo.uri);
      setBase64ImageString(photo.base64);
    }
  };

  const uploadImage = async () => {
    if (!photoUri || !Base64ImageString) return;
  
    // const formData = new FormData();
    // formData.append('image', {
    //   uri: photoUri,
    //   name: 'return.jpg',
    //   type: 'image/jpeg',
    // } as any);
  
    try {

      const body_object = {
        "reason": reason,
        "image_data": Base64ImageString
      };
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/orders/${ORDER_ID}/items/${PRODUCT_ID}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': `${process.env.EXPO_PUBLIC_USER_ID}`
        },
        body: JSON.stringify(body_object)
      });
    
      const result = await response.json();

      if (result.success===true) {
        router.push({
          pathname: '../returns/success',
          params: { qr_string: result.qrCodeData },
        });
      } else if (attemptsLeft > 1) {
        setAttemptsLeft(attemptsLeft - 1);
        Alert.alert(
          '❌ Verification Failed',
          `Attempt failed.\nConfidence: ${Math.round(0.67 * 100)}%\nAttempts left: ${attemptsLeft - 1}`,
          [{ text: 'Retake Photo', onPress: () => setPhotoUri(null) }]
        );
      } else {
        Alert.alert(
          '❌ Failed 3 Times',
          'Product verification unsuccessful.\nPlease visit the customer service desk.',
          [{ text: 'Go Back', onPress: () => router.back() }]
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Upload Error', 'Make sure your server is running and devices are on the same network.');
    }
  };
  

  if (hasPermission === null) {
    return <Text style={{ marginTop: 60, textAlign: 'center' }}>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text style={{ marginTop: 60, textAlign: 'center' }}>Camera access denied.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {!photoUri ? (
        <View style={{ flex: 1 }}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
          />
  
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
          </View>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <Button title="Upload Image" onPress={uploadImage} />
          <Button title="Retake" onPress={() => setPhotoUri(null)} />
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      )}
    </View>
  );
  
}

const styles = StyleSheet.create({
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  captureBtn: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#0071ce',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 20,
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
});
