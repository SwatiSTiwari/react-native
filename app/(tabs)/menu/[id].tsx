import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'



const product = () => {
  const {id}=useLocalSearchParams()
  return (
    <View>
      <Text style={{color:"red"}}>product for :{id}</Text>
    </View>
  )
}

export default product

const styles = StyleSheet.create({})