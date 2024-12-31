import { StyleSheet ,FlatList, ActivityIndicator} from 'react-native';
import { Text, View } from '@/components/Themed';

import ProductListItem from '@/components/ProductListItem';
import products from '@/assets/data/products';import { supabase } from '@/lib/superbase';
import QueryProvider from '@/app/providers/QueryProvider';
import { useQuery } from '@tanstack/react-query';
import { useProductList } from '@/api/product';

export default function MenuScreen() {


  const {data:product, isLoading, error } =useProductList();
 


  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  // useEffect(()=>{
  //   const fetchProducts = async () => {
  //     const { data, error } = await supabase.from('product').select('*');
  //     console.log(data);
  //     console.log(error);

  //   };

  //   fetchProducts();
    
  // },[])
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





