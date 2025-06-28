import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useReturnImagesStore } from "@/store/returnImageStore";

const predefinedReasons = [
  "Wrong size",
  "Damaged item",
  "Received different item",
  "No longer needed",
  "Not up to the mark",
];

export default function ReturnReasonScreen() {
  const router = useRouter();
  const { item, ORDER_ID } = useLocalSearchParams();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");
  const { setreason } = useReturnImagesStore();

  let parsedItem: any;
  try {
    parsedItem = JSON.parse(item as string);
  } catch (err) {
    return (
      <View style={styles.centered}>
        <Text>❌ Failed to load product.</Text>
      </View>
    );
  }

  const handleContinue = () => {
    const reason = customReason.trim();
    if (!reason) {
      Alert.alert("Please enter a valid reason for return.");
      return;
    }
    setreason(selectedReason);
    router.push({
      pathname: "./captureTag",
      params: {
        ORDER_ID,
        PRODUCT_ID: parsedItem._id,
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Select a reason for return</Text>

      {predefinedReasons.map((reason) => (
        <TouchableOpacity
          key={reason}
          onPress={() => {
            setSelectedReason(reason);
            setCustomReason(reason);
          }}
          style={[
            styles.option,
            selectedReason === reason && styles.optionSelected,
          ]}
        >
          <Text
            style={[
              styles.optionText,
              selectedReason === reason && styles.optionTextSelected,
            ]}
          >
            {reason}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Other Reason (Required)</Text>
      <TextInput
        placeholder="Write your reason..."
        value={customReason}
        onChangeText={setCustomReason}
        style={styles.input}
        multiline
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: "#f8f9fa",
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  option: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  optionSelected: {
    borderColor: "#0071ce",
    backgroundColor: "#e6f0fa",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextSelected: {
    color: "#0071ce",
    fontWeight: "600",
  },
  label: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    minHeight: 100,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  continueButton: {
    backgroundColor: "#0071ce",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
