
import React from 'react';
import { Text, View } from 'react-native';
import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { PizzaSize } from '@/types';
import products from '@/assets/data/products';
import Button from '@/components/Button';
import { useCart } from '@/app/providers/CartProvider';
import { FlatList } from 'react-native';
import OrderListItem from '@/components/OrderListItem';
import  OrderItemListItem from '@/components/OrderItemListItem';

import orders from '@/assets/data/orders';
export default function OrderDetailSceen() {



    const { id } = useLocalSearchParams();
  const [selected, setSelected] = useState<PizzaSize>('M');

  const order = orders.find((o) => o.id.toString() === id);
  if(!order){
    return <Text>Order not found</Text>;
  }
  

  const defaultImage = "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/margarita.png";

    return (
        <View style={{ padding: 10, gap: 20, flex: 1 }}>
      <Stack.Screen options={{ title: `Order #${id}` }} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListHeaderComponent={() => <OrderListItem order={order} />}
      />
    </View>
    );
}