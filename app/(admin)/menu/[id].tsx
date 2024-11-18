import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { PizzaSize } from '@/types';
import products from '@/assets/data/products';
import Button from '@/components/Button';
import { useCart } from '@/app/providers/CartProvider';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';


const Sizes: PizzaSize[] = ["S", "M", "L", "XL"];

const Product = () => {  // Capitalized component name
  const { id } = useLocalSearchParams();
  const { addItem } = useCart();
  const router=useRouter();

  const [selected, setSelected] = useState<PizzaSize>('M');

  const product = products.find((p) => p.id.toString() === id);
  
  const addToCart = () => {
    if (!product) {
      return;
    }
    addItem(product, selected);
    router.push('/cart');
    // console.warn("Added to cart", product, selected); 
    
    
  };

  const defaultImage = "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/margarita.png";

  if (!product) {
    return <Text>Product not found</Text>;  // Return instead of just having the statement
  }

  return (
    <View style={styles.container}>

<Stack.Screen
        
           options={
          {title: "Menu", 
            headerRight: () => (
              <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                <Pressable>
                  {({ pressed }) => (
                    <FontAwesome
                    
                      name="plus-square-o"
                      size={25}
                      color={Colors.light.tint}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                  )}
                </Pressable>
              </Link>
            ),
          }}/>
      <Stack.Screen options={{ title: product?.name }} />
      <Image style={styles.image} source={{ uri: product?.image || defaultImage }} />
      <Text style={{ marginBottom: 20 }}>Select Size</Text>
      <View style={styles.sizes}>
        {Sizes.map((size) => (
          <Pressable 
            onPress={() => setSelected(size)}
            key={size} 
            style={[styles.size, { backgroundColor: selected === size ? "blue" : "white" }]}>
            <Text style={[styles.sizeText, { color: selected === size ? "green" : "black" }]}>{size}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.price}>${product?.price}</Text>
      <Button text='Add to Cart' onPress={addToCart} />
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink",
    borderRadius: 20,
    padding: 10,
    flex: 1,
  },
  sizes: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  size: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 25,
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sizeText: {
    color: "black",
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "auto",
  },
  color: {
    color: 'red',
    marginBottom: 40,
  }
});
