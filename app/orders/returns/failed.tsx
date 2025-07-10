import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { router } from "expo-router";


const Failed = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: "Verification Failed",
      headerStyle: {
        backgroundColor: "#0071ce",
      },
      headerTintColor: "#fff",
    });
  }, []);

  const handleGoBack = () => {
    router.dismissAll();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Verification Unsuccessful</Text>
      <Text style={styles.message}>
        Unfortunately, we couldn't verify your product return with the provided photos.
      </Text>
      <Text style={styles.message}>
        To complete your return, please visit your nearest store with your product and receipt.
      </Text>
      <TouchableOpacity onPress={handleGoBack} style={styles.button}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Failed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d9534f", // Bootstrap Danger Red
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    marginTop: 24,
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
