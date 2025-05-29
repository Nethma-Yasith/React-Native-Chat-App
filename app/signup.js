import { StyleSheet, View, Text, TextInput, Pressable, SafeAreaView, Alert, Button, ScrollView } from "react-native";
import * as SplashScreen from "expo-splash-screen"
import { useFonts } from "expo-font";
import { useState, useEffect } from "react";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";


SplashScreen.preventAutoHideAsync();

export default function signup() {

  const [getImage, setImage] = useState(null);

  const logoPath = require("../assets/logo2.png")
  //const avatar = require("./assets/avater.jpg")

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");


  const [loaded, error] = useFonts(
    {
      "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
      "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
      "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    }
  );



  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }



  return (


    <LinearGradient style={stylesheet.view1} colors={['black', 'black']}>

      <StatusBar hidden={true} />

      <ScrollView style={stylesheet.scrol1}>

        <View style={stylesheet.view2}>

          <View style={stylesheet.view3}>

            <Image source={logoPath} style={stylesheet.image1} contentFit={"contain"} />


            <Text style={stylesheet.text1}>Create Account</Text>

          </View>
          <Text style={stylesheet.text2}>Hello! Welcome to Smart Chat, Let's start the Conversation.</Text>

          <Pressable onPress={
            async () => {
              let result = await ImagePicker.launchImageLibraryAsync(
                {}
              );

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }
          } style={stylesheet.avatar1}>
            <Image source={getImage} style={stylesheet.avatar1} contentFit={"contain"} />
          </Pressable>

          <Text style={stylesheet.text3}>Mobile</Text>
          <TextInput style={stylesheet.input1} inputMode={"tel"} maxLength={10} onChangeText={
            (text) => {
              setMobile(text);
            }
          } />

          <Text style={stylesheet.text3}>First Name</Text >
          <TextInput style={stylesheet.input1} inputMode={"text"} onChangeText={
            (text) => {
              setFirstName(text);
            }
          } />

          <Text style={stylesheet.text3}>Last Name</Text>
          <TextInput style={stylesheet.input1} inputMode={"text"} onChangeText={
            (text) => {
              setLastName(text);
            }
          } />

          <Text style={stylesheet.text3}>Password</Text>
          <TextInput style={stylesheet.input1} secureTextEntry={true} inputMode={"text"} maxLength={20} onChangeText={
            (text) => {
              setPassword(text);
            }

          } />

          <Pressable style={stylesheet.pressable1} onPress={
            async () => {

              let formData = new FormData();
              formData.append("mobile", getMobile);
              formData.append("firstName", getFirstName);
              formData.append("lastName", getLastName);
              formData.append("password", getPassword);

              if (getImage != null) {

                formData.append("avatarImage",
                  {
                    name: "avatar.png",
                    type: "image/png",
                    uri: getImage
                  }
                );

              }


              let response = await fetch(
                "http://localhost:8080/SmartChat/SignUp",
                {
                  method: "POST",
                  body: formData

                }
              );
              if (response.ok) {
                let json = await response.json();

                if (json.success) {
                  //user registration complete
                  router.replace("/")
                } else {
                  //problem occured
                  Alert.alert("Error", json.message);
                }
              }
            }
          }>
            <FontAwesome6 name={"right-to-bracket"} color={"white"} size={18} />
            <Text style={stylesheet.buttonText1}>Sign Up</Text>
          </Pressable>

          <Pressable style={stylesheet.pressable2} onPress={
            () => {
              router.replace("/");
            }
          }>
            <Text style={stylesheet.buttonText2}>Alredy Registered ? Go to Sign In</Text>
          </Pressable>
          {/* 
          <Button title={"Hello"} />
          <Button title={"Hello"} />
          <Button title={"Hello"} />
          <Button title={"Hello"} />
          <Button title={"Hello"} />
          <Button title={"Hello"} />
          <Button title={"Hello"} />
          <Button title={"Hello"} />
          <Button title={"Hello"} />
          <Button title={"Hello"} /> */}

        </View>

      </ScrollView>

    </LinearGradient>
  );
}



const stylesheet = StyleSheet.create(
  {
    view1: {
      flex: 1,
      backgroundColor: "black",
      justifyContent: "center",
      // alignItems:"center",
      // paddingHorizontal: 10,
      // paddingTop: 30,
      // rowGap: 10,

    },
    image1: {
      width: "100%",
      height: 100,
      borderRadius: 50,
      alignSelf: "center",

    },

    text1: {
      color: "#8c52ff",
      fontFamily: "Poppins-Bold",
      fontSize: 28,
      alignSelf: "center",
    },
    text2: {
      color: "white",
      fontFamily: "Poppins-Light",
      fontSize: 18,
      marginBottom: 10,
    },
    text3: {
      color: "white",
      fontFamily: "Poppins-Bold",
      fontSize: 15,
    },
    buttonText1: {
      color: "white",
      fontFamily: "Poppins-Bold",
      fontSize: 18,
    },
    input1: {
      width: "100%",
      height: 50,
      borderStyle: "solid",
      // borderWidth: 2,
      borderColor: "#8c52ff",
      borderRadius: 15,
      backgroundColor: "white",
      paddingStart: 10,
      fontSize: 15,
      fontFamily: "Poppins-Regular"

    },
    pressable1: {
      height: 50,
      backgroundColor: "#8c52ff",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginTop: 15,
      flexDirection: "row",
      columnGap: 10,
    },
    pressable2: {
      height: 30,
      // backgroundColor: "red",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      // marginTop: 15,
    },
    buttonText2: {
      color: "white",
      fontFamily: "Poppins-Regular",
      fontSize: 15,
    },
    avatar1: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: "white",
      justifyContent: "center",
      alignSelf: "center",

    },
    view2: {
      flex: 1,
      paddingHorizontal: 15,
      paddingVertical: 40,
      rowGap: 10,
    },
    view3: {
      flexDirection: "row",
      columnGap: 15,
    },
  }
);