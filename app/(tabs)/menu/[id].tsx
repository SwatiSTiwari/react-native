import { StyleSheet, Text, View,Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { Stack } from 'expo-router'
import { PizzaSize } from '@/types'
import products from '@/assets/data/products'
import Button from '@/components/Button'
const Sizes=["S","M","L","XL"];



const product = () => {
  const {id}=useLocalSearchParams()
  const[select,setSelected]=useState(false)

  const product=products.find((p)=>p.id.toString()===id)
  const addTocart=()=>{
    console.warn("add to cart");
  }
  const  defaultImage="https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/margarita.png"


  if(!product){
    <Text>product not foun</Text>
  }
  return (
    <View  style={styles.container}>  
      <Stack.Screen options={{title:product?.name}} />
      <Image style={styles.image} source={{uri:product?.image || defaultImage}} />
      <Text style={{marginBottom:20}}>selct size</Text>
      <View style={styles.sizes}>

      {Sizes.map((size)=>(
        <Pressable onPress={(()=>setSelected(size))}

         key={size} style={[styles.size, { backgroundColor: select==size ? "blue" : "white" }]}>
        <Text style={[styles.sizeText,{color:select==size ? "green": "black" }]}>{size}</Text>
        
        </Pressable>
      )
        )}





        </View>
      <Text style={styles.price}>${product?.price}</Text>
      <Button text='add to cart>' onPress={addTocart}/>
    </View>
  )
}

export default product

const styles = StyleSheet.create({

  container:{
    backgroundColor:"pink",
    borderRadius:20,
    padding:10,
    flex:1,

  },
  sizes:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  size:{
    backgroundColor:"white",
    padding:10,
    borderRadius:25,
    width:50,
    aspectRatio:1,
    alignItems:"center",
    justifyContent:"center",
  },
  sizeText:{
    color:"black",
    fontWeight:"bold",
  },


  image:{
    width:"100%",
    aspectRatio:1,
  },
  price:{
    fontSize:20,
    fontWeight:"bold",
    marginTop:"auto",
  },
  
  color:{
    color:'red',
    marginBottom:40,
  }
})