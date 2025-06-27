// app/orders/product/captureAccessories.tsx
import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Button, StyleSheet, Alert } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function CaptureAccessoriesScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const { reason, orderId, itemId, tagPhotoUri, rotationUris } = useLocalSearchParams();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  const uploadAll = async () => {
    if (!photoUri) return;

    const formData = new FormData();
    formData.append("reason", reason as string);
    formData.append("tagImage", {
      uri: tagPhotoUri as string,
      name: "tag.jpg",
      type: "image/jpeg",
    } as any);

    JSON.parse(rotationUris as string).forEach((uri: string, idx: number) => {
      formData.append(`rotation${idx + 1}`, {
        uri,
        name: `rotation${idx + 1}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    formData.append("accessoriesImage", {
      uri: photoUri,
      name: "accessories.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/orders/${orderId}/items/${itemId}/return`,
        {
          method: "POST",
          headers: { "Content-Type": "multipart/form-data", "x-user-id": `${process.env.EXPO_PUBLIC_USER_ID}` },
          body: formData,
        }
      );
      const resJson = await response.json();
      Alert.alert("Upload Complete", "Your return request has been submitted.");
      router.replace("/orders");
    } catch (err) {
      console.error(err);
      Alert.alert("Upload Error", "Please try again.");
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.centeredText}>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text style={styles.centeredText}>Camera access denied.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {!photoUri ? (
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
      ) : (
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
      )}
      {!photoUri ? (
        <View style={styles.captureContainer}>
          <Text style={styles.instructions}>Take a photo of the product with all accessories.</Text>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
        </View>
      ) : (
        <View style={styles.buttons}>
          <Button title="Retake" onPress={() => setPhotoUri(null)} />
          <Button title="Upload All" onPress={uploadAll} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  captureContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#0071ce",
    marginTop: 10,
  },
  instructions: {
    color: "#fff",
    fontWeight: "600",
  },
  centeredText: {
    marginTop: 60,
    textAlign: "center",
  },
  previewImage: {
    flex: 1,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
