import { StatusBar } from 'expo-status-bar'
import {Platform, Text, View} from 'react-native'
import { useCart } from './providers/CartProvider'
import { FlatList } from 'react-native'
import CartListItem from '../components/CartListItem'
import Button from '../components/Button'


const cart = () => {
  const {items}= useCart()

  console.log(items)

    return (
    <View style={{padding: 10}}>
    <FlatList
    data={items}
    renderItem={({item}) => <CartListItem cartItem={item}/>}
    contentContainerStyle={{ gap:10}}
    
    />
    <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    <Text style={{marginVertical: 10, fontSize: 18, fontWeight: "500"}}>Total:</Text>
    <Button text='Check Out'/>

    </View>
  )
}

export default cart