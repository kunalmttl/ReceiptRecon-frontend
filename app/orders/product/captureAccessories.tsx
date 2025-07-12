import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useReturnImagesStore } from "@/store/returnImageStore";
import { useNavigation } from "expo-router";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import compressImage from "@/store/functions";

export default function CaptureAccessoriesScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const [WITH_ACCESSORIES_IMAGE, setWITH_ACCESSORIES_IMAGE] =
    useState<string>("");
  const router = useRouter();
  const navigation = useNavigation();
  const { reason, ORDER_ID, PRODUCT_ID, TAG_PHOTO_URI, retried, retriedSteps } = useLocalSearchParams();
  const { setphotoURI, photoURI, accessoryPhotos, setAccessoryPhotos } =
    useReturnImagesStore();

    useEffect(() => {
      navigation.setOptions({
        title: "Capture image with accessories",
        headerStyle: {
          backgroundColor: "#0071ce",
        },
        headerTintColor: "#fff",
      });
    }, []);

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
      const base64_string = await compressImage(photo.uri);
      if(!base64_string){
        console.error("No tagphoto base64 found.");
        return;
      }
    //   const fileUri = FileSystem.documentDirectory + 'image_base64.txt';
    // await FileSystem.writeAsStringAsync(fileUri, photo.uri, {
    //   encoding: FileSystem.EncodingType.UTF8,
    // });
    // console.log("Base64 written to:", fileUri);
    
    // if (await Sharing.isAvailableAsync()) {
    //   await Sharing.shareAsync(fileUri);
    // } else {
    //   alert("Sharing is not available on this device");
    // }
      setWITH_ACCESSORIES_IMAGE(base64_string);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.centeredText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.centeredText}>Camera access denied.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: photoUri ? "#fff" : "#000" }}>
      {!photoUri ? (
        <>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
          />
          <View style={styles.overlay}>
            <Text style={styles.instructionText}>
              📷 Take a photo of the product with all accessories.
            </Text>
          </View>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.btnText}>Capture Photo</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.heading}>📸 Review Your Photo</Text>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />

          <TouchableOpacity
            style={styles.againBtn}
            onPress={() => setPhotoUri(null)}
          >
            <Ionicons name="refresh" size={18} color="#0071ce" />
            <Text style={styles.againBtnText}>Retake Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              setphotoURI([...photoURI, photoUri]);
              setAccessoryPhotos([WITH_ACCESSORIES_IMAGE]);
              router.push({
                pathname: "/orders/product/confirmPage",
                params: {
                  ORDER_ID,
                  PRODUCT_ID,
                },
              });
            }}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 8,
  },
  instructionText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
  captureButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0071ce",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
  },
  previewImage: {
    width: "100%",
    height: 400,
    borderRadius: 8,
  },
  againBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#0071ce",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  againBtnText: {
    color: "#0071ce",
    fontWeight: "600",
    marginLeft: 6,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#0071ce",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  centeredText: {
    color: "#fff",
    fontSize: 16,
  },
});
