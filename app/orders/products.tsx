//NEW
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { HeaderBackButton } from "@react-navigation/elements";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export default function ProductPage() {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const { order } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      title: "Order Details",
      headerStyle: {
        backgroundColor: "#0071ce",
      },
      headerTintColor: "#fff",
      headerShown: true,
    });

    if (order) {
      const parsedOrder = JSON.parse(order as string);
      setOrderData(parsedOrder);
      setLoading(false);
    }
  }, [order]);

  const isReturnable = (purchaseDate: string) => {
    const purchaseTime = new Date(purchaseDate).getTime();
    const now = new Date().getTime();
    return now - purchaseTime < 90 * 24 * 60 * 60 * 1000; // 90 days
  };

  if (loading || !orderData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0071CE" />
      </View>
    );
  }

  async function handleClick(item: any) {
    router.push({
      pathname: "/orders/product/[id]",
      params: {
        id: item.id,
        item: JSON.stringify({
          ...item,
          purchase_date: orderData.purchase_date,
          ORDER_ID: orderData.id,
        }),
      },
    });
  }

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: 24,
          paddingHorizontal: CARD_MARGIN,
        }}
        showsVerticalScrollIndicator={false}
        data={orderData.order_items}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const product = item.products;
          const returnable = isReturnable(orderData.purchase_date);
          const returnStatus = item.return_status ?? "NONE";
          return (
            <Pressable
              onPress={() => handleClick(item)}
              style={styles.itemWrapper}
            >
              <View style={styles.cardContainer}>
                <Image
                  source={{
                    uri: product.image_url.startsWith("http")
                      ? product.image_url
                      : `${process.env.EXPO_PUBLIC_BACKEND_URL}${product.image_url}`,
                  }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productPrice}>₹{product.price}</Text>
                  <Text
                    style={[
                      styles.returnStatus,
                      {
                        color:
                          returnable && returnStatus === "NONE"
                            ? "#4CAF50"
                            : returnStatus !== "NONE"
                            ? "#FF9800"
                            : "#9E9E9E",
                      },
                    ]}
                  >
                    {returnable && returnStatus === "NONE"
                      ? "✅ Returnable"
                      : returnStatus !== "NONE"
                      ? `🔁 ${returnStatus}`
                      : "❌ Return Window Closed"}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F6",
  },
  header: {
    backgroundColor: "#0071CE",
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  itemWrapper: {
    width: CARD_WIDTH,
    marginVertical: CARD_MARGIN,
    marginHorizontal: 2,
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    height: 240,
    margin: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    gap: 10,
  },
  productImage: {
    width: "100%",
    height: "60%",
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  productInfo: {
    height: "40%",
    marginTop: 0,
    justifyContent: "space-evenly"
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 13,
    color: "#0071CE",
    fontWeight: "500",
    marginBottom: 2,
  },
  returnStatus: {
    fontSize: 12,
    fontWeight: "500",
  }
});



