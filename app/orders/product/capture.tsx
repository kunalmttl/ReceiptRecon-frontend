import { CameraView, useCameraPermissions} from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function CaptureScreen() {
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions(); // ✅ correct usage
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedPhoto(photo.uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {!permission?.granted ? (
        <Text style={{ marginTop: 50, textAlign: 'center' }}>
          Please grant camera permissions in settings.
        </Text>
      ) : (
        <>
          {!capturedPhoto ? (
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing="back"
              ratio="16:9"
            >
              <View style={styles.cameraButtonContainer}>
                <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
              </View>
            </CameraView>
          ) : (
            <View style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Preview:</Text>
              <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
              <Button title="Confirm and Return" onPress={() => alert('Return initiated!')} />
              <Button title="Retake" color="gray" onPress={() => setCapturedPhoto(null)} />
              <Button title="Go Back" onPress={() => router.back()} />
            </View>
          )}
        </>
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
  previewLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
