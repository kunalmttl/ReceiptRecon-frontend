import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useReturnImagesStore } from "@/store/returnImageStore";
import * as FileSystem from "expo-file-system";

const ConfirmPage = () => {
  const { ORDER_ID, PRODUCT_ID } = useLocalSearchParams();

  const { photoURI, reason, tagPhoto, accessoryPhotos, photos360 } =
    useReturnImagesStore();
  const router = useRouter();

  const writeToFile = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + "trial.txt";
      const data = tagPhoto[0];
      await FileSystem.writeAsStringAsync(fileUri, data);
      console.log("File written successfully:", fileUri);
    } catch (error) {
      console.error("Error writing file:", error);
    }
  };

  const handleSubmit = async () => {
    // await writeToFile();
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/orders/${ORDER_ID}/items/${PRODUCT_ID}/return`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": `${process.env.EXPO_PUBLIC_USER_ID}`,
          },
          body: JSON.stringify({
            reason,
            orderId: ORDER_ID,
            productId: PRODUCT_ID,
            base64_images_encoding: [tagPhoto, accessoryPhotos, photos360],
          }),
        }
      );

      const data = await response.json();
      if (data.success === true) {
        router.push({
          pathname: "/orders/returns/success",
          params: {
            qr_string: data.qrCodeData,
            ORDER_ID,
            PRODUCT_ID
          },
        });
      }
    } catch (error) {
      console.error("Error submitting return:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>✅ Review and Submit</Text>

      <ScrollView
        contentContainerStyle={styles.imagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {photoURI && photoURI.length > 0 ? (
          photoURI.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.image}
            />
          ))
        ) : (
          <Text style={styles.placeholderText}>No photos captured.</Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
      >
        <Ionicons name="checkmark" size={20} color="#fff" />
        <Text style={styles.submitBtnText}>Submit Return Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
  },
  imagesContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginVertical: 8,
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0071ce",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: "auto",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
