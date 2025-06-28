// app/orders/product/captureAccessories.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useReturnImagesStore } from "@/store/returnImageStore";


export default function CaptureAccessoriesScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const [WITH_ACCESSORIES_IMAGE, setWITH_ACCESSORIES_IMAGE] =
    useState<string>("");
  const router = useRouter();
  const { reason, ORDER_ID, PRODUCT_ID, TAG_PHOTO_URI } = useLocalSearchParams();
  const { setphotoURI, photoURI,accessoryPhotos,setAccessoryPhotos } = useReturnImagesStore();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setPhotoUri(photo.uri);
      setWITH_ACCESSORIES_IMAGE(photo.base64);
    }
  };

  if (hasPermission === null) {
    return (
      <Text style={styles.centeredText}>Requesting camera permission...</Text>
    );
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
          <Text style={styles.instructions}>
            Take a photo of the product with all accessories.
          </Text>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          />
        </View>
      ) : (
        <View style={styles.buttons}>
          <Button title="Retake" onPress={() => setPhotoUri(null)} />
          <Button
            title="Continue"
            onPress={() => {
              setphotoURI([...photoURI,photoUri]);
              setAccessoryPhotos([WITH_ACCESSORIES_IMAGE]);
              router.push({
                pathname: "/orders/product/confirmPage",
                params: {
                  ORDER_ID,
                  PRODUCT_ID,
                },
              });
            }}
          />
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
