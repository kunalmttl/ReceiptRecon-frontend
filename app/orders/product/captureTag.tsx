import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import compressImage from "@/store/functions";
import { useReturnImagesStore } from "@/store/returnImageStore";

export default function CaptureTagScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const [local_image_base64, setlocal_image_base64] = useState("")
  const { reason, ORDER_ID, PRODUCT_ID } = useLocalSearchParams();
  const navigation = useNavigation();
  const { setTagPhoto, setphotoURI } = useReturnImagesStore();


  useEffect(() => {
    navigation.setOptions({
      title: "Capture image with tag",
      headerStyle: {
        backgroundColor: "#0071ce", // Blue background
      },
      headerTintColor: "#fff", // Make title and icons white
    });
  }, []);

  const handleContinue = () => {
    if(!photoUri){
      console.log("No photoUri found.");
      return;
    }
    setphotoURI([photoUri])
    setTagPhoto([local_image_base64]);
    router.push({
      pathname: "/orders/product/capture360",
      params: {
        ORDER_ID,
        PRODUCT_ID,
      },
    });
  };

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
      setlocal_image_base64(base64_string);
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
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {!photoUri ? (
        <>
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
          <View style={styles.overlay} />

          {/* Instructions overlay */}
          <View style={styles.instructionBar}>
            <Text style={styles.instructionText}>
              Make sure the product's tag or branding is clearly visible.
            </Text>
          </View>

          {/* Capture button */}
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <Ionicons name="camera" size={28} color="#0071ce" />
            </TouchableOpacity>
            <Text style={styles.instructions}>Tap to capture</Text>
          </View>
        </>
      ) : (
        <>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <View style={styles.previewInstruction}>
            <Text style={styles.previewInstructionText}>
              Ensure the tag is readable before continuing.
            </Text>
          </View>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setPhotoUri(null)}
            >
              <Ionicons name="refresh" size={20} color="#0071ce" />
              <Text style={styles.retakeButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Ionicons name="arrow-forward" size={20} color="#fff" />
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  instructionBar: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0071ce",
    marginBottom: 8,
  },
  instructions: {
    color: "#fff",
    fontWeight: "500",
  },
  previewImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  previewInstruction: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  previewInstructionText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: "#f2f2f2",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0071ce",
  },
  retakeButtonText: {
    marginLeft: 6,
    color: "#0071ce",
    fontWeight: "600",
  },
  continueButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#0071ce",
    borderRadius: 8,
  },
  continueButtonText: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "600",
  },
  centeredText: {
    marginTop: 60,
    textAlign: "center",
    color: "#555",
  },
});
