import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const mockProducts = {
  '1': {
    name: 'T-Shirt',
    description: 'Blue cotton T-shirt',
    returnable: true,
    price: 599,
    purchased_date: '2024-03-01',
    image_url: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRgcN3w2deQwygKrY_Jtuoay72wOCEkBxRsu98JWpyQGy4L4zqem8wlsMOrzwYZ8wEX6ApRfCHFKFjqmdfmZy34Nr5ZZGqO5W_AWeqAqvE',
  },
  '2': {
    name: 'Coffee Maker',
    description: 'Electric 2-cup coffee machine',
    returnable: false,
    price: 2999,
    purchased_date: '2023-11-15',
    image_url: 'https://via.placeholder.com/150x150.png?text=Coffee+Maker',
  },
} as const;

export default function ProductPage() {
  const { id } = useLocalSearchParams();
  const product = mockProducts[id as keyof typeof mockProducts];
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: product?.name ?? 'Product Detail',
    });
  }, [product]);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image_url }}
        style={styles.productImage}
        resizeMode="contain"
      />

      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.meta}>
        <Text style={styles.metaLabel}>Purchased on:</Text>
        <Text style={styles.metaValue}>{product.purchased_date}</Text>
      </View>

      <View style={styles.meta}>
        <Text style={styles.metaLabel}>Return Status:</Text>
        <Text style={[styles.metaValue, { color: product.returnable ? '#2e7d32' : '#888' }]}>
          {product.returnable ? '✅ Returnable' : '❌ Return Window Closed'}
        </Text>
      </View>

      {product.returnable && (
        <View style={styles.returnBtn}>
          <Button title="Return Product" color="#0071ce" onPress={() => router.push('/orders/product/capture')} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
  },
  productName: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '500',
    color: '#0071ce',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  metaLabel: {
    fontWeight: '600',
    marginRight: 8,
  },
  metaValue: {
    fontWeight: '400',
  },
  returnBtn: {
    marginTop: 20,
  },
});
