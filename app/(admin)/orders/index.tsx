import { ActivityIndicator, FlatList,Text } from 'react-native';
import orders from '@/assets/data/orders'
import OrderListItem from '../../../components/OrderListItem';
import { Stack } from 'expo-router';
import React from 'react';
import { useMyOrderList } from '@/api/orders';

export default function OrdersScreen() {


  const { data: orders, isLoading, error } = useMyOrderList({ archived: false });
if (isLoading) {
  return <ActivityIndicator />;
}
if (error) {
  return <Text>Failed to fetch</Text>;
}
  return (
    <>
      <Stack.Screen options={{ title: 'Orders' }} />
      <FlatList
        data={orders}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        renderItem={({ item }) => <OrderListItem order={item} />}
      />
    </>
  );
}