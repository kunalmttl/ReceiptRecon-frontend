import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";

export default function ProductPage() {
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const { order } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

    if (order) {
      // console.log(order);
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
        id: item._id,
        item: JSON.stringify({
          ...item,
          purchaseDate: orderData.purchaseDate,
          ORDER_ID: orderData._id,
        }),
      },
    });
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order Details</Text>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        data={orderData.purchasedItems}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const product = item.product;
          const returnable = isReturnable(orderData.purchaseDate);
          const returnStatus = item.returnInfo?.status ?? "NONE";
          return (
            <Pressable
              onPress={() => handleClick(item)}
              style={[
                styles.itemCard,
                {
                  borderRightColor:
                    returnable && returnStatus === "NONE"
                      ? "#4CAF50"
                      : "#9E9E9E",
                },
              ]}
            >
              <Image
                source={{
                  uri: product.imageUrl.startsWith("http")
                    ? product.imageUrl
                    : `https://receiptrecon-backendnode.onrender.com${product.imageUrl}`,
                }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
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
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderRightWidth: 8, // ✅ RIGHT side strip
    marginHorizontal: 12,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#0071CE",
    fontWeight: "500",
    marginBottom: 2,
  },
  returnStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
});
