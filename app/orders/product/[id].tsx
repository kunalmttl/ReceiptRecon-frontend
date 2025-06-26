import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
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
} from "react-native";
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
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrImage, setQrImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/getoneProduct`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: id }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        const prod = data.product?.[0];
        setProduct(prod);
        navigation.setOptions({
          headerShown: true,
          title: prod?.product_name ?? "Product Detail",
        });

        // fetch QR if return was initiated
        if (prod?.return_status === "initiated") {
          // console.log(prod.user, prod);
          
          const qrRes = await fetch(
            `${process.env.EXPO_PUBLIC_BACKEND_URL}/getReturnQR`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user: prod.user,
                product_id: prod._id,
              }),
            }
          );
          const qrData = await qrRes.json();
          // console.log(qrData);
          setQrImage(qrData.qr_string); // assuming qr is an image URL
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0071ce" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image }}
        style={styles.productImage}
        resizeMode="contain"
      />

      <Text style={styles.productName}>{product.product_name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.meta}>
        <Text style={styles.metaLabel}>Purchased on:</Text>
        <Text style={styles.metaValue}>
          {new Date(product.purchased_date).toDateString()}
        </Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaLabel}>Return Status:</Text>
        <Text
          style={[
            styles.metaValue,
            {
              color:
                product.return_status === "windowClosed" ? "#888" : "#2e7d32",
            },
          ]}
        >
          {product.return_status === "windowClosed"
            ? "❌ Return Window Closed"
            : `✅ ${product.return_status}`}
        </Text>
      </View>

      {product.return_status === "initiated" && qrImage && (
        <View style={{ marginTop: 32, alignItems: "center" }}>
          <Text style={{ fontWeight: "600", marginBottom: 12 }}>
            🧾 Return QR Code
          </Text>
          <View style={{ marginVertical: 30 }}>
            <QRCode value={qrImage} size={200} />
          </View>
        </View>
      )}

      {product.return_status !== "windowClosed" &&
        product.return_status !== "initiated" && (
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
              <Button
                title="Return Product"
                color="#0071ce"
                onPress={() =>
                  router.push({
                    pathname: "/orders/product/capture",
                    params: {
                      productId: id,
                    },
                  })
                }
              />
            </View>
          </>
        )}
    </View>
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
  description: {
    fontSize: 14,
    color: "#333",
    marginBottom: 12,
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
});
