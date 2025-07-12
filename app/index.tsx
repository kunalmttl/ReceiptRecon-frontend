// app/Home.tsx or Home.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { test_message } from "@/store/tests";

const categories = [
  { label: "Grocery", icon: "cart" },
  { label: "Electronics", icon: "laptop-outline" },
  { label: "Clothing", icon: "shirt-outline" },
  { label: "Home", icon: "home-outline" },
  { label: "Pharmacy", icon: "medkit-outline" },
  { label: "Toys", icon: "game-controller-outline" },
  { label: "Sports", icon: "football-outline" },
  { label: "Beauty", icon: "rose-outline" },
  { label: "Automotive", icon: "car-outline" },
  { label: "Pets", icon: "paw-outline" },
] as const;

const deals = [
  {
    title: "Samsung A73",
    image:
      "https://tinyurl.com/a73parjjo",
  },
  {
    title: 'Nobero Oversized Fit TShirt',
    image:
      "https://tinyurl.com/noberofit",
  },
  {
    title: "Adidas Sneakers White",
    image:
    "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQO_FK7HbgAOCDIW3Mce9E1CCMg8-9-SwAe-h9789MZV2fksy7QJiPxtuO3tcDCU5mgXA6NGzcTU0JKOiS5bXDfxPCW3LqxIYQA3Nu7n7C-G-GMA0Gn8PP7_Br54yNOzM9qPybDGcZxOA&usqp=CAc"
  },
  {
    title: "BeYoung Forest green Tshirt",
    image:
      "https://i5.walmartimages.com/seo/LEGO-Classic-Large-Creative-Brick-Box-790-Pieces-For-Kids-4-99_c88ff6ee-c17e-443e-981d-6545d349e580.27dca85c71615bc13c8c32b38e7f0ba9.jpeg",
  },
  {
    title: "Adidas White Sneakers",
    image:
      "https://i5.walmartimages.com/seo/HP-15-6-Touch-Laptop-Intel-Core-i5-16GB-RAM-512GB-SSD-Windows-11_8b31fc12-bb0c-4da9-9a4f-9e8ed130aa25.6fa914b81c3b3aa198b0baf0d7310dc3.jpeg",
  },
  {
    title: "Yamaha Helmet",
    image:
      "https://i5.walmartimages.com/asr/2a5e0da5-7f68-4d3a-b9c5-c0d9704d979f.18f340e267fbb21ba3c346a875e8cf92.jpeg",
  },
  {
    title: "Xbox Series S Console",
    image:
      "https://i5.walmartimages.com/asr/cc315189-410c-4f14-9460-379b2c4c0d5c.2dc9a7f78b91e2359d90edc3f55af57c.jpeg",
  },
  {
    title: "NutriBullet Pro Blender",
    image:
      "https://i5.walmartimages.com/seo/NutriBullet-Pro-900W-Personal-Blender-9-Piece-Set_2b441d75-4aa2-41e3-9e0f-0f0dd1e4dc91.4464c2c807f0e93a0b14b176d2d92470.jpeg",
  },
];
export default function Home() {
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      title: "Walmart",
      headerStyle: {
        backgroundColor: "#0071ce",
      },
      headerTintColor: "#fff",
      headerShown: true
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#555"
          style={{ marginHorizontal: 8 }}
        />
        <TextInput
          placeholder="Search Walmart"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Image
          source={{
            uri: "https://tinyurl.com/a73parjjo"
          }}
          style={styles.banner}
        />

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.label}
                style={styles.categoryItem}
              >
                <Ionicons name={category.icon} size={28} color="#005CB9" />
                <Text style={styles.categoryText}>{category.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Deals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Deals</Text>
          <View style={styles.verticalDeals}>
            {deals.map((deal, idx) => (
              <TouchableOpacity key={idx} style={styles.dealRow}>
                <Image
                  source={{ uri: deal.image }}
                  style={styles.dealRowImage}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text numberOfLines={2} style={styles.dealRowTitle}>
                    {deal.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* <View>
          <Pressable onPress={()=>router.push({
            pathname: "/orders/returns/failed",
            params: {object: JSON.stringify(test_message)}
          })}>
            <Text>Go to testing</Text>
          </Pressable>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#0071CE",
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop:40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
    margin: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontWeight:600
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  banner: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },
  categoryText: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },
  dealItem: {
    width: 120,
    marginRight: 12,
  },
  dealImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  dealText: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },
  verticalDeals: {
    flexDirection: "column",
  },
  dealRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 8,
  },
  dealRowImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  dealRowTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});