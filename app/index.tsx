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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfDc0d-vaLJ7IwHPJLoSMgf5J6B4AnkOPi2A&s",
  },
  {
    title: "Yamaha Helmet",
    image:
      "data:image/jpeg;base64,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",
  }
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