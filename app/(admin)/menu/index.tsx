import {ActivityIndicator, StyleSheet ,FlatList} from 'react-native';
import { Text, View } from '@/components/Themed';

import ProductListItem from '@/components/ProductListItem';
import products from '@/assets/data/products';
import { useProductList } from '@/api/product';

export default function MenuScreen() {


  const {data:product, isLoading, error } =useProductList();
   
  
  
    if (isLoading) {
      return <ActivityIndicator />;
    }
  
    if (error) {
      return <Text>Error: {error.message}</Text>;
    }
  return (
    <>
    <FlatList

    data={product}

    renderItem={({item})=> <ProductListItem product={item}/>}
    numColumns={2}
    contentContainerStyle={{ gap: 10, padding: 10 }}
    columnWrapperStyle={{ gap: 10 }}
    
    />
    </>
   
  );
}



// import { Redirect } from "expo-router";

// export default function TabIndex() {
//   return <Redirect href={"/(user)/menu/"} />;
// }


