import { registerRootComponent } from "expo";
import * as SplashScreen from "expo-splash-screen";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { Image } from 'expo-image';
import { useFonts, } from "expo-font";

import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";



SplashScreen.preventAutoHideAsync();

export default function home() {

    const [getChatArray, setChatArray] = useState([]);

    const [loaded, error] = useFonts(
        {
            "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
            "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
            "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        }
    );

    useEffect(
        () => {
            async function fetchData() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);
                let response = await fetch(process.env.EXPO_PUBLIC_URL+"/SmartChat/LoadHomeData?id=" + user.id);

                if (response.ok) {
                    let json = await response.json();
                    if (json.success) {
                        let chatArray = json.jsonChatArray;
                        console.log(chatArray);
                        setChatArray(chatArray);

                    }

                }
            }
            fetchData();
        }, []
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
        <LinearGradient colors={["black", "black"]} style={stylesheet.view1}>


            <FlashList
                data={getChatArray}
                renderItem={
                    ({ item }) =>
                        <Pressable style={stylesheet.view5} onPress={
                            ()=>{
                                // Alert.alert("View Chat","User:"+item.other_user_id);
                                router.push(
                                    {
                                        pathname:"/chat",
                                        params:item
                                    }
                                );
                            }
                        }>

                            <View style={item.other_user_status == 1 ? stylesheet.view6_online : stylesheet.view6_offline}>
                                
                                {
                                    item.avatar_image_found ?
                                        <Image 
                                        source={process.env.EXPO_PUBLIC_URL+"/SmartChat/AvatarImages/"+item.other_user_mobile+".png"} 
                                        contentFit="contain"
                                        style={stylesheet.image1}
                                        />
                                        :
                                        <Text style={stylesheet.text6}>{item.other_user_avatar_letters}</Text>
                                }
                            </View>

                            <View style={stylesheet.view4}>
                                <Text style={stylesheet.text1}>{item.other_user_name}</Text>
                                <Text style={stylesheet.text4} numberOfLines={1}>{item.message}</Text>

                                <View style={stylesheet.view7}>
                                    <Text style={stylesheet.text5}>{item.dateTime}</Text>
                                    <FontAwesome6 name={"check"} color={item.chat_status_id == 1 ? "green" : "white"} size={18} />
                                </View>

                            </View>
                        </Pressable>

                }
                estimatedItemSize={200}
            />

        </LinearGradient>
    );
}



const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,
            paddingVertical: 30,
            paddingHorizontal: 20,


        },

        view4: {
            flex: 1,
            // width: "70%",
            // height: 80,
            // backgroundColor: "yellow",
            // // borderRadius: 40,
        },
        text1: {
            fontFamily: "Poppins-Bold",
            fontSize: 22,
            color: "white",
        },
        text2: {
            fontFamily: "Poppins-Regular",
            fontSize: 16,
            color: "white",
        },
        text3: {
            fontFamily: "Poppins-Regular",
            fontSize: 14,
            alignSelf: "flex-end",
            color: "white",
        },
        view5: {
            flexDirection: "row",
            marginVertical: 8,
            columnGap: 20,
            // backgroundColor: "yellow",
        },
        view6_offline: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "white",
            borderStyle: "dotted",
            borderWidth: 4,
            borderColor: "red",
            justifyContent: "center",
            alignItems: "center",
        },
        view6_online: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "white",
            borderStyle: "dotted",
            borderWidth: 4,
            borderColor: "green",
            justifyContent: "center",
            alignItems: "center",
        },
        text4: {
            fontFamily: "Poppins-Regular",
            fontSize: 18,
            color: "white",
        },
        text5: {
            fontFamily: "Poppins-Regular",
            fontSize: 14,
            color: "white",
            // alignSelf:"flex-end",
        },
        Scrollview: {
            marginTop: 30,
            // backgroundColor:"yellow",
        },
        view7: {
            marginTop: 7,
            flexDirection: "row",
            columnGap: 10,
            alignSelf: "flex-end",
            alignItems: "center",
        },
        text6: {
            fontFamily: "Poppins-Bold",
            fontSize: 28,
        },
        image1:{
            width:70,
            height:70,
            borderRadius:40,
            backgroundColor:"white",
            justifyContent:"center",
            alignSelf:"center",
        },
    }
);