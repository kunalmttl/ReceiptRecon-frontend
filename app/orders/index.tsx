import { View, Text, FlatList, Image, Pressable, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useNavigation } from "expo-router";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "My Orders",
    });
  }, []);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/getMyOrders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '685d095991e761cd0ee17f2a',
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, []);
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <FlatList
        data={orders}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/orders/product/[id]",
                params: { id: item._id },
              })
            }
            style={{
              flexDirection: "row",
              marginBottom: 16,
              backgroundColor: "#f9f9f9",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              borderRightWidth: 10,
              borderRightColor:
                new Date().getTime() -
                  new Date(item.purchased_date).getTime() <
                90 * 24 * 60 * 60 * 1000
                  ? "#4CAF50"
                  : "#9E9E9E",
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{
                width: 60,
                height: 60,
                marginRight: 12,
                borderRadius: 8,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "500" }}>
                {item.product_name}
              </Text>
              <Text style={{ fontSize: 14, color: "#555" }}>
                ₹{item.price}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color:
                    new Date().getTime() -
                      new Date(item.purchased_date).getTime() <
                    90 * 24 * 60 * 60 * 1000
                      ? "#4CAF50"
                      : "#9E9E9E",
                }}
              >
                {new Date().getTime() -
                  new Date(item.purchased_date).getTime() <
                90 * 24 * 60 * 60 * 1000
                  ? "✅ Returnable"
                  : "❌ Return Window Closed"}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
