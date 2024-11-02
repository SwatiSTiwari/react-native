import { StyleSheet ,Image} from 'react-native';
import { Text, View } from '@/components/Themed';

import products from '@/assets/data/products';
const product=products[0];

export default function TabOneScreen() {
  return (
    <View style={styles.container}>

      <Image style={styles.image} source={{uri:product.image}}/>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.color}>${product.price}</Text>
    </View>
   
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor:"pink",
    borderRadius:30,
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
