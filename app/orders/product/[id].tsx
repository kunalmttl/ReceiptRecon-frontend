import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { getQRString } from "@/store/asyncStore";
import QRCode from "react-native-qrcode-svg";

const exampleImages = [
  {
    id: "1",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4ilkvfCjj-XiIwS-bDSvFsUAYDUoumhiDzQ&s",
  },
  {
    id: "2",
    uri: "https://ifhpclothing.com/cdn/shop/products/unisex-staple-t-shirt-black-front-63964693b1135.jpg?v=1670794677&width=1946",
  },
  {
    id: "3",
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfRWVXf3nvRj1vckAGmIwJ82_utgxnxIDsIQ&s",
  },
];

export default function ProductPage() {
  const { item } = useLocalSearchParams();
  const navigation = useNavigation();
  const [productItem, setProductItem] = useState<any>(null);
  const router = useRouter();
  const [qr_string, setqr_string] = useState("");

  const get_qr_if_exist = async () => {
    const qr = await getQRString(JSON.parse(item as string)._id);
    // console.log("qr: ", qr);
    if (!qr) {
      console.log("qr exists but is null.");
      return;
    }
    setqr_string(qr);
  };

  useEffect(() => {
    get_qr_if_exist();
    // console.log(item);
  }, []);

  useEffect(() => {
    if (!item) return;
    console.log(item);
    
    try {
      const parsedItem = JSON.parse(item as string);
      // console.log(parsedItem);
      setProductItem(parsedItem);

      navigation.setOptions({
        headerShown: true,
        title: parsedItem.product.name ?? "Product Detail",
      });
    } catch (err) {
      console.error("Failed to parse item param:", err);
    }
  }, [item]);

  if (!productItem) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0071ce" />
      </View>
    );
  }

  const purchaseDate = new Date(productItem.purchaseDate);
  const isWithinReturnWindow =
    new Date().getTime() - purchaseDate.getTime() <= 90 * 24 * 60 * 60 * 1000;

  const returnStatus = productItem.returnInfo?.status;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: productItem.product.imageUrl }}
        style={styles.productImage}
        resizeMode="contain"
      />

      <Text style={styles.productName}>{productItem.product.name}</Text>
      <Text style={styles.price}>₹{productItem.priceAtPurchase}</Text>

      <View style={styles.meta}>
        <Text style={styles.metaLabel}>Purchased on:</Text>
        <Text style={styles.metaValue}>{purchaseDate.toDateString()}</Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaLabel}>Return Status:</Text>
        <Text
          style={[
            styles.metaValue,
            {
              color:
                returnStatus === "APPROVED"
                  ? "#2e7d32"
                  : returnStatus === "NONE"
                  ? "#888"
                  : "#0071ce",
            },
          ]}
        >
          {returnStatus === "APPROVED"
            ? "✅ Return Completed"
            : returnStatus === "NONE"
            ? isWithinReturnWindow
              ? "🕒 Eligible for Return"
              : "❌ Return Window Closed"
            : returnStatus}
        </Text>
      </View>

      {returnStatus === "NONE" && isWithinReturnWindow && qr_string === "" && (
        <>
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontWeight: "600", marginBottom: 8 }}>
              📸 Example Product Shots:
            </Text>
            <FlatList
              data={exampleImages}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 8,
                    backgroundColor: "#eee",
                  }}
                />
              )}
            />
          </View>

          <View style={styles.returnBtn}>
            <TouchableOpacity
              style={{
                backgroundColor: "#0071ce",
                paddingVertical: 14,
                borderRadius: 10,
                marginTop: 24,
                alignItems: "center",
              }}
              onPress={() => {
                // Implement navigation to return capture page
                router.push({
                  pathname: "./returnReason",
                  params: { item: item, ORDER_ID: productItem.ORDER_ID },
                });
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Return
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 24,
              padding: 12,
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 8 }}>
              📋 Return Photo & Video Guidelines
            </Text>
            <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
              1️⃣ Take a clear photo of the item showing the brand label or tag
              visibly.
            </Text>
            <Text style={{ fontSize: 14, color: "#555", marginBottom: 4 }}>
              2️⃣ Record a short video rotating the item 360° to show its overall
              condition.
            </Text>
            <Text style={{ fontSize: 14, color: "#555" }}>
              3️⃣ Capture a photo of the item along with any accessories. If no
              accessories are included, take a front photo of the item.
            </Text>
          </View>
        </>
      )}
      {qr_string !== "" && (
        <View style={styles.qrContainer}>
          <Text style={styles.qrHeading}>🎫 Your Return QR Code</Text>
          <View style={styles.qrWrapper}>
            <QRCode value={qr_string as string} size={220} />
          </View>
          <Text style={styles.qrInstruction}>
            Show this QR at the returns desk to complete your return.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#f2f2f2",
  },
  productName: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "500",
    color: "#0071ce",
    marginBottom: 10,
  },
  meta: {
    flexDirection: "row",
    marginBottom: 6,
  },
  metaLabel: {
    fontWeight: "600",
    marginRight: 8,
  },
  metaValue: {
    fontWeight: "400",
  },
  returnBtn: {
    marginTop: 20,
  },
  qrContainer: {
    alignItems: "center",
    marginVertical: 32,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrHeading: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  qrWrapper: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  qrInstruction: {
    marginTop: 16,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});
