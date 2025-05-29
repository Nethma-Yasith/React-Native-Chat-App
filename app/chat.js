import { Image } from 'expo-image';
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, TextInput, Pressable, Alert } from "react-native";
import { SplashScreen, useLocalSearchParams } from 'expo-router';
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function chat() {

    //get parameters
    const item = useLocalSearchParams();

    // console.log(item.other_user_id);

    //store chat array
    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");

    const [loaded, error] = useFonts(
        {
            "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
            "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
            "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        }
    );


    useEffect(() => {
        console.log("3");
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    //fetch chat array from server
    useEffect(
        () => {
            async function fetchChatArray() {

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson)

                let response = await fetch("http://localhost:8080/SmartChat/LoadChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id);
                if (response.ok) {
                    let chatArray = await response.json();
                    // console.log(chatArray);
                    setChatArray(chatArray);

                }
            }
            fetchChatArray();
            
            setInterval(()=> {
                fetchChatArray();
            }, 2000);
        }, []
    );

    if (!loaded && !error) {
        console.log("4");
        return null;
    }

    return (
        <LinearGradient colors={["black", "black"]} style={stylesheet.view1}>

            <View style={stylesheet.view2}>
                <View style={stylesheet.view3}>
                    {
                        item.avatar_image_found == "true"
                            ? <Image style={stylesheet.image1} source={"http://localhost:8080/SmartChat/AvatarImages/" + item.other_user_mobile + ".png"} contentFit="contain" />
                            : <Text style={stylesheet.text1}>{item.other_user_avatar_letters}</Text>
                    }

                </View>
                <View style={stylesheet.view4}>
                    <Text style={stylesheet.text2}>{item.other_user_name}</Text>
                    <Text style={stylesheet.text3}>{item.other_user_status == 1 ? "Online" : "Offline"}</Text>
                </View>
            </View>

            <View style={stylesheet.center_view}>

                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>
                            <View style={item.side == "right" ? stylesheet.view5_from : stylesheet.view5_to}>
                                <Text style={stylesheet.text4}>{item.message}</Text>
                                <View style={stylesheet.view6}>
                                    <Text style={stylesheet.text5}>{item.datetime}</Text>
                                    {
                                        item.side == "right" ?
                                            <FontAwesome6 name={"check"} color={item.status == 1 ? "green" : "white"} size={18} />
                                            : null
                                    }
                                </View>
                            </View>
                    }
                    estimatedItemSize={200}
                />


                {/* <View style={stylesheet.view5_to}>
                    <Text style={stylesheet.text4}>Message</Text>
                    <View style={stylesheet.view6}>
                        <Text style={stylesheet.text5}>Sep 14, 10:20 AM</Text>
                        {
                            false ?
                                <FontAwesome6 name={"check"} color={true ? "green" : "white"} size={18} />
                                : null
                        }
                    </View>

                </View> */}
            </View>

            <View style={stylesheet.view7}>
                <TextInput style={stylesheet.input1} value={getChatText} onChangeText={
                    (text) => {
                        setChatText(text);
                    }
                } />
                <Pressable style={stylesheet.pressable1} onPress={
                    async () => {

                        if (getChatText.length == 0) {
                            Alert.alert("Error","Please enter your Message.")
                        } else {

                            let userJson = await AsyncStorage.getItem("user");
                            let user = JSON.parse(userJson);
                            let response = await fetch("http://localhost:8080/SmartChat/SendChat?logged_user_id=" + user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText);
                            if (response.ok) {
                                let json = await response.json();

                                if (json.success) {
                                    console.log("Message Sent");
                                    setChatText("");
                                }
                            }
                        }


                    }
                }>
                    <FontAwesome6 name={"paper-plane"} color={"white"} size={18} />
                </Pressable>
            </View>

        </LinearGradient>
    );
}

const stylesheet = StyleSheet.create(
    {
        view1: {
            flex: 1,

        },
        view2: {
            // backgroundColor:"yellow",
            marginTop: 20,
            paddingHorizontal: 20,
            flexDirection: "row",
            columnGap: 15,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
        },
        view3: {
            backgroundColor: "white",
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: "center",
            alignItems: "center",
            borderStyle: "solid",
            borderColor: "white",
            borderWidth: 1,
        },
        image1: {
            width: 70,
            height: 70,
            borderRadius: 35,
        },
        text1: {
            fontSize: 35,
            fontFamily: "Poppins-Bold",
            color: "black",
        },
        view4: {
            rowGap: 4,
        },
        text2: {
            fontSize: 22,
            fontFamily: "Poppins-Bold",
            color: "white",
        },
        text3: {
            fontSize: 15,
            fontFamily: "Poppins-Regular",
            color: "white",
        },
        view5_from: {
            backgroundColor: "#bd9cff",
            borderRadius: 10,
            padding: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            justifyContent: "center",
            alignSelf: "flex-end",
            rowGap: 3,
        },
        view5_to: {
            backgroundColor: "white",
            borderRadius: 10,
            padding: 10,
            marginHorizontal: 20,
            marginVertical: 5,
            justifyContent: "center",
            alignSelf: "flex-start",
            rowGap: 3,
        },
        view6: {
            flexDirection: "row",
            columnGap: 10,
        },
        text4: {
            fontSize: 15,
            fontFamily: "Poppins-Regular",
        },
        text5: {
            fontSize: 12,
            fontFamily: "Poppins-Regular",
        },
        view7: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            columnGap: 10,
            paddingHorizontal: 20,
            marginVertical: 15,
        },
        input1: {
            height: 40,
            borderRadius: 10,
            borderStyle: "solid",
            borderWidth: 2,
            fontFamily: "Poppins-Regular",
            fontSize: 18,
            backgroundColor: "white",
            flex: 1,
            paddingStart: 10,
        },
        pressable1: {
            backgroundColor: "#8c52ff",
            borderRadius: 12,
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
        },
        center_view: {
            flex: 1,
            marginVertical: 15,
        },
    }
);