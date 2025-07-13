import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CameraView } from "expo-camera";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useReturnImagesStore } from "@/store/returnImageStore";
import { useNavigation } from "expo-router";
import compressImage from "@/store/functions";

export default function VideoRecorder() {
  const router = useRouter();
  const cameraRef = useRef<CameraView>(null);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // 🔥 Popup state

  const {
    ORDER_ID,
    PRODUCT_ID,
    TAG_PHOTO_URI,
    reason,
    retried,
    retriedSteps,
  } = useLocalSearchParams();
  const navigation = useNavigation();
  const { setPhotos360, photoURI, setphotoURI } = useReturnImagesStore();

  useEffect(() => {
    navigation.setOptions({
      title: "Take a video",
      headerStyle: { backgroundColor: "#0071ce" },
      headerTintColor: "#fff",
    });
  }, []);

  const generateThumbnails = async (videoUri: string) => {
    if (!videoUri) return;
    const intervals = [2000, 4000, 6000, 8000];
    const generated: string[] = [];

    setGenerating(true);
    useReturnImagesStore.setState({ photos360: [], photoURI: [] });

    try {
      for (const time of intervals) {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
          time,
        });
        generated.push(uri);
        const base64_gen_string = await compressImage(uri);
        if (!base64_gen_string) {
          console.log("Error in generating image from:", uri);
          setGenerating(false);
          return;
        }
        useReturnImagesStore.setState((state) => ({
          four_photos: [...state.four_photos.slice(-3), base64_gen_string],
        }));
      }
      setThumbnails(generated);
      setphotoURI([...photoURI, ...generated]);

      // ✅ Show popup
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (e) {
      console.warn("Thumbnail generation failed:", e);
    } finally {
      setGenerating(false);
    }
  };

  const startRecording = async () => {
    if (cameraRef.current && !recording) {
      setRecording(true);
      try {
        const video = await cameraRef.current.recordAsync();
        if (video?.uri) {
          setVideoUri(video.uri);
          setRecording(false);
          generateThumbnails(video.uri);
        }
      } catch (error) {
        console.log("Error in recording:", error);
        setRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && recording) {
      cameraRef.current.stopRecording();
    }
  };

  const resetSession = () => {
    setVideoUri(null);
    setThumbnails([]);
    setRecording(false);
  };

  const handleContinue = () => {
    if (retried === "false" || JSON.parse(retriedSteps as string).length === 0) {
      router.push({
        pathname: "/orders/product/captureAccessories",
        params: { ORDER_ID, PRODUCT_ID, retried: "false", retriedSteps },
      });
    } else {
      const steps = JSON.parse(retriedSteps as string);
      if (steps.length === 1) {
        router.push({
          pathname: "/orders/product/confirmPage",
          params: { ORDER_ID, PRODUCT_ID, retried: "false", retriedSteps },
        });
      } else if (steps.length === 2 && steps[1] === "contents_verification") {
        router.push({
          pathname: "/orders/product/captureAccessories",
          params: { ORDER_ID, PRODUCT_ID, retried: "false", retriedSteps },
        });
      } else {
        router.push({
          pathname: "/orders/product/confirmPage",
          params: { ORDER_ID, PRODUCT_ID, retried: "false", retriedSteps },
        });
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {showPopup && (
        <View style={styles.popupContainer}>
          <View style={styles.popupBox}>
            <Ionicons name="checkmark-circle" size={28} color="#28a745" />
            <Text style={styles.popupText}>Thumbnails Generated!</Text>
          </View>
        </View>
      )}

      {!videoUri ? (
        <>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            videoStabilizationMode="auto"
            mode="video"
            mute
          />
          <View style={styles.overlay}>
            <Text style={styles.instructionText}>
              🎥 Rotate the item slowly in front of the camera.{"\n"}⏳ Record a
              video about 8–10 seconds long.
            </Text>
          </View>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
              style={[
                styles.recordBtn,
                recording && { backgroundColor: "#555" },
              ]}
            >
              <Ionicons
                name={recording ? "stop" : "videocam"}
                size={24}
                color="#fff"
              />
              <Text style={styles.btnText}>
                {recording ? "Stop Recording" : "Start Recording"}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : generating ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="blue" />
          <Text style={styles.loaderText}>Generating thumbnails...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.previewContainer}>
          <Text style={styles.heading}>🎞️ Review Video Thumbnails</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >
            {thumbnails.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.thumbnail} />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.againBtn} onPress={resetSession}>
            <Ionicons name="refresh" size={18} color="#0071ce" />
            <Text style={styles.againBtnText}>Retake Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={handleContinue}>
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
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
  recordBtn: {
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
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    color: "black",
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginHorizontal: 5,
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loaderText: {
    color: "blue",
    fontSize: 16,
    marginTop: 10,
  },
  popupContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1000,
  },
  popupBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f9ec",
    borderColor: "#28a745",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  popupText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#28a745",
    fontWeight: "600",
  },
});
