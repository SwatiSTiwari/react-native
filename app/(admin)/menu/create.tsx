import { StyleSheet, Text, View ,TextInput,Image, Alert } from 'react-native'
import React from 'react'
import { useState } from 'react';
import Button from "../../../components/Button"
import * as ImagePicker from 'expo-image-picker';
import { Stack,useLocalSearchParams } from 'expo-router';



const  defaultPizzImage="https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/margarita.png"

const CreateProductScreen = () => {
    const { id } = useLocalSearchParams();
    const isUpdatinng = !!id;


    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error,setError] = useState('');
    const [image, setImage] = useState<string | null>(null);







    const validForm = () => {
        setError('');
        if(!name && !price){
            setError('Name and Price are required');
            return false;
        }
        if(isNaN(parseFloat(price))){
            setError('Price must be a number');
            return false;
        }
        return true;

    }

    const resetFields = () => {
        setName('');
        setPrice('');
    }



    const onCreate = () => {

        if(!validForm()){
            return false
        }
        console.warn("creating product", name, price);    
        resetFields();

       
    }

    const onUpdateCreate = () => {

        if(!validForm()){
            return false
        }
        console.warn("updating product", name, price);    
        resetFields();

       
    }

    const onDelete=()=>{
        
        if(!validForm()){
            return false
        }
        console.warn("creating product", name, price);    
        resetFields();
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };


      const onSubmit=()=>{
        if(isUpdatinng){
            onUpdateCreate();

        }
        else{
            onCreate();
        }
      }

      
    const confirmDelete = () => {
        console.log("delete button is clucked")
        Alert.alert("confirm","are you sure you want to  delete  the product?",[
            {
                text:"cancel",
            },
            {
                text:"delete",
                onPress:onDelete,
                style:"destructive"

            },
        ])
    }

    
  return (
    
    <View style={styles.container}>
        <Stack.Screen  options={{title: isUpdatinng?"create product ":"create prodcut"}}/>
        <Image source={{uri:image||defaultPizzImage}} style={styles.image}
        
        />
        <Text  onPress={pickImage}style={styles.text}>select image</Text>
      <Text style={styles.label}>Name</Text>
        <TextInput 
        value={name}
        onChangeText={setName}
        placeholder="Name" style={styles.input} />

        <Text style={styles.label}>Price($)</Text>
        <TextInput
        value={price}
        onChangeText={setPrice}
         placeholder="99.99" style={styles.input}
         keyboardType='numeric'
         
         />
            <Text style={{color:"red"}}>{error}</Text>

        <Button onPress={onSubmit} text={ isUpdatinng? "update":"Create"} />
        {isUpdatinng && <Text onPress={confirmDelete} style={styles.text}>Delete</Text>}
    </View>
  )
}

export default CreateProductScreen;

const styles = StyleSheet.create({

    container:
    {
        flex:1,
        justifyContent:'center',
        padding:10
    },
    label:{
        fontSize:20,
        fontWeight:'bold',
        color:"white"
    },
    input:{
        
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    color:"pink"
    },

    image:{
        width:"50%",
        aspectRatio:1,
        alignSelf:"center",
        


    },
    text:{
        fontSize:20,
        alignSelf:"center",
        color:"blue"

    }




})