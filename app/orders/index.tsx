// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   Pressable,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import { useEffect, useState } from "react";
// import { useRouter, useNavigation } from "expo-router";

// export default function OrdersScreen() {
//   const [flattenedItems, setFlattenedItems] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const navigation = useNavigation();

//   useEffect(() => {
//     navigation.setOptions({
//       headerShown: false
//     });
//   }, []);
  

//   useEffect(() => {
//     console.log('orders loaded');
//     fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/orders`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "x-user-id": `${process.env.EXPO_PUBLIC_USER_ID}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {        
//         // console.log(data);
        
//         const items = data.flatMap((order: any) =>
//           order.purchasedItems.map((item: any) => ({
//             ...item,
//             purchaseDate: order.purchaseDate,
//             ORDER_ID: order._id,
//           }))
//         );
//         setFlattenedItems(items);
//       })
//       .catch((err) => {
//         console.error("Error fetching orders:", err);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const isReturnable = (purchaseDate: string) => {
//     const purchaseTime = new Date(purchaseDate).getTime();
//     const now = new Date().getTime();
//     return now - purchaseTime < 90 * 24 * 60 * 60 * 1000; // 90 days
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0071CE" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>My Account</Text>
//       </View>
//       <FlatList
//         contentContainerStyle={{ paddingBottom: 24 }}
//         showsVerticalScrollIndicator={false}
//         data={flattenedItems}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => {
//           const returnable = isReturnable(item.purchaseDate);
//           const product = item.product;
//           const returnStatus = item.returnInfo?.status ?? "NONE";

//           return (
//             <Pressable
//               onPress={() =>
//                 router.push({
//                   pathname: "/orders/product/[id]",
//                   params: { id: item._id, item: JSON.stringify(item) },
//                 })
//               }
//               style={({ pressed }) => [
//                 styles.card,
//                 pressed && { opacity: 0.95 },
//                 {
//                   borderRightColor:
//                     returnable && returnStatus === "NONE"
//                       ? "#4CAF50"
//                       : "#9E9E9E",
//                 },
//               ]}
//             >
//               <Image
//                 source={{
//                   uri: product.imageUrl.startsWith("http")
//                     ? product.imageUrl
//                     : `https://receiptrecon-backendnode.onrender.com${product.imageUrl}`,
//                 }}
//                 style={styles.productImage}
//               />
//               <View style={styles.productInfo}>
//                 <Text style={styles.productName}>{product.name}</Text>
//                 <Text style={styles.productPrice}>₹{product.price}</Text>
//                 <Text
//                   style={[
//                     styles.returnStatus,
//                     {
//                       color:
//                         returnable && returnStatus === "NONE"
//                           ? "#4CAF50"
//                           : returnStatus !== "NONE"
//                           ? "#FF9800"
//                           : "#9E9E9E",
//                     },
//                   ]}
//                 >
//                   {returnable && returnStatus === "NONE"
//                     ? "✅ Returnable"
//                     : returnStatus !== "NONE"
//                     ? `🔁 ${returnStatus}`
//                     : "❌ Return Window Closed"}
//                 </Text>
//               </View>
//             </Pressable>
//           );
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F2F4F6",
//   },
//   header: {
//     backgroundColor: "#0071CE",
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     paddingTop:40
//   },
//   headerText: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "600",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     borderRightWidth: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 3,
//     marginHorizontal:12,
//     marginTop:16
//   },
//   productImage: {
//     width: 70,
//     height: 70,
//     borderRadius: 10,
//     backgroundColor: "#eee",
//   },
//   productInfo: {
//     flex: 1,
//     marginLeft: 14,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#222",
//     marginBottom: 4,
//   },
//   productPrice: {
//     fontSize: 14,
//     color: "#0071CE",
//     fontWeight: "500",
//     marginBottom: 2,
//   },
//   returnStatus: {
//     fontSize: 12,
//     fontWeight: "500",
//   },
// });



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
import { useRouter, useNavigation } from "expo-router";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": `${process.env.EXPO_PUBLIC_USER_ID}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const isReturnable = (purchaseDate: string) => {
    const purchaseTime = new Date(purchaseDate).getTime();
    const now = new Date().getTime();
    return now - purchaseTime < 90 * 24 * 60 * 60 * 1000; // 90 days
  };

  async function handleClick (order: any) {
    router.push({
      pathname:  "/orders/products",
      params: {order:JSON.stringify(order)}
    })
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0071CE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Orders</Text>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        data={orders}
        keyExtractor={(order) => order._id}
        renderItem={({ item: order }) => (
          <Pressable style={styles.orderCard} onPress={()=>handleClick(order)}>
            <Text style={styles.orderDate}>
              Order Date: {new Date(order.purchaseDate).toDateString()}
            </Text>
            {order.purchasedItems.map((item: any) => {
              const product = item.product;
              const returnable = isReturnable(order.purchaseDate);
              const returnStatus = item.returnInfo?.status ?? "NONE";
              return (
                <Pressable
                  key={item._id}
                  // onPress={() =>
                  //   router.push({
                  //     pathname: "/orders/product/[id]",
                  //     params: { id: item._id, item: JSON.stringify(item) },
                  //   })
                  // }
                  style={({ pressed }) => [
                    styles.itemCard,
                    pressed && { opacity: 0.95 },
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
            })}
          </Pressable>
        )}
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
  orderCard: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  orderDate: {
    fontSize: 14,
    fontWeight: "500",
    color: "#444",
    marginBottom: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginTop: 12,
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
