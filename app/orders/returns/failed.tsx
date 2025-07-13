// import React, { useEffect } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useNavigation } from "expo-router";
// import { router } from "expo-router";
// import { useLocalSearchParams } from "expo-router";

// const Failed = () => {
//   const navigation = useNavigation();
//   const {object} = useLocalSearchParams();
//   useEffect(() => {
//     console.log(JSON.parse(object as string));
//     navigation.setOptions({
//       title: "Verification Failed",
//       headerStyle: {
//         backgroundColor: "#0071ce",
//       },
//       headerTintColor: "#fff",
//       HeaderBackButton: false
//     });
//   }, []);

//   const handleGoBack = () => {
//     router.dismissAll();
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.icon}>⚠️</Text>
//       <Text style={styles.title}>Verification Unsuccessful</Text>
//       <Text style={styles.message}>
//         Unfortunately, we couldn't verify your product return with the provided photos.
//       </Text>
//       <Text style={styles.message}>
//         To complete your return, please visit your nearest store with your product and receipt.
//       </Text>
//       <TouchableOpacity onPress={handleGoBack} style={styles.button}>
//         <Text style={styles.buttonText}>Back to Home</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default Failed;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 24,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   icon: {
//     fontSize: 60,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#d9534f", // Bootstrap Danger Red
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   message: {
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   button: {
//     marginTop: 24,
//     backgroundColor: "#0071ce",
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
// });

// New

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

const retakeRouteMapping = {
  branding_verification: "/orders/product/captureTag",
  condition_verification: "/orders/product/capture360",
  contents_verification: "/orders/product/captureAccessories",
} as const;

type VerificationCategory = keyof typeof retakeRouteMapping;

const Failed = () => {
  const navigation = useNavigation();
  const { object } = useLocalSearchParams();
  const { photoURI = [] } = useReturnImagesStore();

  const verificationResult = object ? JSON.parse(object as string) : null;

  useEffect(() => {
    console.log(photoURI);
    navigation.setOptions({
      title: "Verification Failed",
      headerStyle: {
        backgroundColor: "#0071ce",
      },
      headerTintColor: "#fff",
      HeaderBackButton: false,
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
        const images = indexes.map((i) => photoURI[i]);
        failedVerifications.push({
          category: key as VerificationCategory,
          reason: value.reason,
          images,
        });
      }
    }
  }

  const handleGoBack = () => {
    router.dismissAll();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Verification Unsuccessful</Text>

      <>
        {failedVerifications.map((fail, idx) => (
          <View key={idx} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {getCategoryTitle(fail.category)}
            </Text>
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
                    source={{ uri: `${img}` }}
                    style={styles.imageLarge}
                  />
                ) : (
                  <View key={i} style={styles.placeholderLarge}>
                    <Text style={styles.placeholderText}>No Image</Text>
                  </View>
                )
              )}
            </ScrollView>
          </View>
        ))}

        <Text style={styles.message}>
          Verification failed, visit your nearest store with your product and receipt.
        </Text>
      </>

      <TouchableOpacity onPress={handleGoBack} style={styles.button}>
        <Text style={styles.buttonText}>Back to My Orders</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Failed;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  icon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d9534f",
    textAlign: "center",
    marginBottom: 8,
  },
  section: {
    width: "100%",
    marginTop: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reason: {
    fontSize: 15,
    color: "#666",
    marginBottom: 8,
  },
  imageScroll: {
    marginTop: 8,
    flexDirection: "row",
    alignSelf: "center",
  },
  imageLarge: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  placeholderLarge: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  placeholderText: {
    color: "#999",
    fontSize: 12,
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginVertical: 12,
  },
  button: {
    marginTop: 32,
    backgroundColor: "#0071ce",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
