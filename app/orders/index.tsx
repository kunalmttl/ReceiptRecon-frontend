import { View, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

const products = [
  {
    product_id: '1',
    product_name: 'T-Shirt',
    description: 'Blue cotton T-shirt',
  },
  {
    product_id: '2',
    product_name: 'Coffee Maker',
    description: 'Electric 2-cup coffee machine',
  },
];

export default function Orders() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: 'My Orders' });
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.product_id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/orders/product/${item.product_id}`)}
            style={{
              padding: 16,
              backgroundColor: '#eee',
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.product_name}</Text>
            <Text style={{ fontSize: 12, color: '#555' }}>{item.description}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
