import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useReturnImagesStore } from "@/store/returnImageStore";
import { useNavigation } from "expo-router";

const ConfirmPage = () => {
  const { ORDER_ID, PRODUCT_ID } = useLocalSearchParams();
  const navigation = useNavigation();
  const { photoURI, reason, tagPhoto, accessoryPhotos, four_photos } =
    useReturnImagesStore();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      title: "Confirm",
      headerStyle: {
        backgroundColor: "#0071ce", // Blue background
      },
      headerTintColor: "#fff", // Make title and icons white
    });
    console.log([
      tagPhoto.length,
      accessoryPhotos.length,
      useReturnImagesStore.getState().four_photos.length,
    ]);
    console.log(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/orders/${ORDER_ID}/items/${PRODUCT_ID}/return`
    );
  }, []);

  const handleSubmit = async () => {
    // await writeToFile();
    try {
      // console.log();
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
            base64_images_encoding: [tagPhoto, four_photos, accessoryPhotos],
          }),
        }
      );
      // [[tagPhoto],[photos360],[accessoryPhotos]] : [[1 element],[4 element],[1 element]]

      const data = await response.json();
      console.log(data);
      // console.log([tagPhoto.length, accessoryPhotos.length, useReturnImagesStore.getState().four_photos.length]);

      if (data.success === true) {
        router.push({
          pathname: "/orders/returns/success",
          params: {
            qr_string: data.qrCodeData,
            ORDER_ID,
            PRODUCT_ID,
          },
        });
      } else {
        router.push({
          pathname: "/orders/returns/failed",
        });
      }
    } catch (error) {
      console.error("Error submitting return:", error);
    } finally {
      useReturnImagesStore((state) => state.clearAll);
      useReturnImagesStore.setState((state) => ({
        four_photos: []
      }));
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
            <Image key={index} source={{ uri }} style={styles.image} />
          ))
        ) : (
          <Text style={styles.placeholderText}>No photos captured.</Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={styles.submitBtnText}>Submit Return Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
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
  footer: {
    paddingVertical: 14,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0071ce",
    paddingVertical: 14,
    borderRadius: 8,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
