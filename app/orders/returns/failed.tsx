import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation, useLocalSearchParams, router } from "expo-router";
import { useReturnImagesStore } from "@/store/returnImageStore";
import { Ionicons } from "@expo/vector-icons";

const retakeRouteMapping = {
  branding_verification: "/orders/product/captureTag",
  condition_verification: "/orders/product/capture360",
  contents_verification: "/orders/product/captureAccessories",
} as const;

type VerificationCategory = keyof typeof retakeRouteMapping;

const Failed = () => {
  const navigation = useNavigation();
  const { object, ORDER_ID, PRODUCT_ID } = useLocalSearchParams();
  const { photoURI = [] } = useReturnImagesStore();

  const verificationResult = object ? JSON.parse(object as string) : null;

  useEffect(() => {
    navigation.setOptions({
      title: "Verification Failed",
      headerStyle: {
        backgroundColor: "#0071ce",
      },
      headerTintColor: "#fff",
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.replace("/orders")}>
          <Ionicons name="close" size={24} color="#fff" style={{ marginLeft: 16 }} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const imageMapping = {
    branding_verification: [0],
    condition_verification: [1, 2, 3, 4],
    contents_verification: [5],
  };

  const getCategoryTitle = (key: string) => {
    switch (key) {
      case "branding_verification":
        return "Branding Verification";
      case "condition_verification":
        return "Condition Verification";
      case "contents_verification":
        return "Contents Verification";
      default:
        return "Verification";
    }
  };

  const failedVerifications: {
    category: VerificationCategory;
    reason: string;
    images: (string | undefined)[];
  }[] = [];

  if (verificationResult?.details) {
    for (const [key, valueRaw] of Object.entries(verificationResult.details)) {
      const value = valueRaw as { passed: boolean; reason: string };
      if (value.passed === false) {
        const indexes = imageMapping[key as VerificationCategory];
        const images = indexes ? indexes.map((i) => photoURI[i]) : [];
        failedVerifications.push({
          category: key as VerificationCategory,
          reason: value.reason,
          images,
        });
      }
    }
  }

  const handleGoBack = () => {
    router.replace("/orders");
  };

  const handleRetake = (category: VerificationCategory) => {
    const steps = failedVerifications.map(v => v.category);
    router.push({
      pathname: retakeRouteMapping[category],
      params: { 
        ORDER_ID, 
        PRODUCT_ID,
        retried: 'true',
        retriedSteps: JSON.stringify(steps)
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Verification Unsuccessful</Text>
      <Text style={styles.mainMessage}>
        Unfortunately, our AI system couldn't verify some parts of your return. You can retake the photos for specific sections or visit a store.
      </Text>

      {failedVerifications.length > 0 ? (
        failedVerifications.map((fail, idx) => (
          <View key={idx} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {getCategoryTitle(fail.category)}
              </Text>
              <TouchableOpacity
                onPress={() => handleRetake(fail.category)}
                style={styles.retakeBtn}
              >
                <Ionicons name="camera" size={16} color="#0071ce" />
                <Text style={styles.retakeBtnText}>Retake</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.reason}>{fail.reason}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
            >
              {fail.images.map((img, i) =>
                img ? (
                  <Image
                    key={i}
                    source={{ uri: img }}
                    style={styles.imageLarge}
                  />
                ) : (
                  <View key={i} style={styles.placeholderLarge}>
                    <Text style={styles.placeholderText}>No Image Found</Text>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        ))
      ) : (
        <View style={styles.section}>
          <Text style={styles.reason}>
            {verificationResult?.message || "An unknown error occurred during verification."}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.message}>
          To complete your return without retaking photos, please visit your nearest store with your product and receipt.
        </Text>

        <TouchableOpacity onPress={handleGoBack} style={styles.button}>
          <Text style={styles.buttonText}>Back to My Orders</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Failed;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  icon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d9534f",
    textAlign: "center",
    marginBottom: 12,
  },
  mainMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  section: {
    width: "100%",
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fdfdfd",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  retakeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f2fa",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  retakeBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0071ce",
    marginLeft: 6,
  },
  reason: {
    fontSize: 15,
    color: "#d93025",
    lineHeight: 20,
    marginBottom: 12,
  },
  imageScroll: {
    flexDirection: "row",
  },
  imageLarge: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  placeholderLarge: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
  },
  footer: {
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  message: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#0071ce",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
