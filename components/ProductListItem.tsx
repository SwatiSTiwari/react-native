import { StyleSheet ,Image} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

import { Product } from '@/types';

import products from '@/assets/data/products';
const product=products[0];

type ProductListItemProps={
    product:Product;
}

const  defaultImage="https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/margarita.png"




export default function ProductListItem({product}:ProductListItemProps) {
  return (
    <Link href={`/menu/${product.id}`} asChild>
    
    <Pressable style={styles.container}>

<Image style={styles.image} source={{uri:product.image || defaultImage}} />
<Text style={styles.title}>{product.name}</Text>
<Text style={styles.color}>${product.price}</Text>
</Pressable>
    
    </Link>
    
   
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"pink",
    borderRadius:20,
    padding:10,
    flex:1,
    maxWidth:"50%",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom:10,
    
  },
  image:{
    width:"100%",
    aspectRatio:1,
  },
  
  color:{
    color:'red',
    marginBottom:40,
  }
});
