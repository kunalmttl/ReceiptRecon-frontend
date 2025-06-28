import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams,useRouter } from "expo-router";
import { useReturnImagesStore } from "@/store/returnImageStore";
import * as FileSystem from "expo-file-system";


const ConfirmPage = () => {
  const {
    ORDER_ID,
    PRODUCT_ID
  } = useLocalSearchParams();

  const { photoURI,reason,tagPhoto,accessoryPhotos,photos360 } = useReturnImagesStore();
  const router = useRouter();

  const writeToFile = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + "trial.txt";
  
      // Your data to write
      const data = tagPhoto[0];
  
      // Write to the file
      await FileSystem.writeAsStringAsync(fileUri, data);
  
      console.log("File written successfully:", fileUri);
    } catch (error) {
      console.error("Error writing file:", error);
    }
  };

  const handleSubmit = async () => {
    // await writeToFile();
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/orders/${ORDER_ID}/items/${PRODUCT_ID}/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": `${process.env.EXPO_PUBLIC_USER_ID}`
        },
        body: JSON.stringify({
          reason,               
          orderId: ORDER_ID,    
          productId: PRODUCT_ID, 
          base64_images_encoding: [tagPhoto,accessoryPhotos,photos360] 
        }),
      });
  
      const data = await response.json();
      if(data.success===true){
        router.push({
            pathname: "/orders/returns/success",
            params:{
                qr_string: data.qrCodeData
            }
        })
      }
    } catch (error) {
      console.error("Error submitting return:", error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Confirm Page</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {photoURI && photoURI.length > 0 ? (
        photoURI.map((uri, index) => (
          <Image
            key={index}
            source={{ uri: uri }}
            style={styles.image}
          />
        ))
      ) : (
        <Text style={styles.placeholderText}>No photos captured.</Text>
      )}
    </ScrollView>
  );
};

export default ConfirmPage;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0071ce",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 8,
    borderRadius: 8,
  },
  placeholderText: {
    marginTop: 20,
    color: "#888",
  },
});
