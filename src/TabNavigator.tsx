
// Uygulamanın Tab (alt menü) navigasyonunu yöneten yapıdır.
// Alt menüde Hikayeler, Sohbetler, Arkadaşlar, Arkadaşlık İstekleri ve Profil ekranlarını barındırır.
import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { supabase } from "./lib/supabase";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from "./screens/ProfileScreen";
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
//import FriendsScreen from "./screens/FriendsScreen";
import StoriesScreen from "./screens/StoriesScreen";
import { FriendRequestsScreen } from "./screens/FriendRequestScreen";


const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

const ChatStackScreen: React.FC = () => (
  <ChatStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#121212' }, headerTintColor: '#fff' }}>
    <ChatStack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Sohbetler' }} />
    <ChatStack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Sohbet' }} />
  </ChatStack.Navigator>
);

const TabNavigator: React.FC = () => {
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);
  return (
    <Tab.Navigator
      initialRouteName="Sohbetler"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#121212" },
        headerTintColor: "#fff",
        tabBarStyle: { backgroundColor: "#121212" },
        tabBarActiveTintColor: "#4E9F3D",
        tabBarInactiveTintColor: "#fff",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'help-outline';

          if (route.name === 'Hikayeler') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Sohbetler') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Arkadaşlar') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Arkadaşlık İstekleri') {
            iconName = focused ? 'person-add' : 'person-add-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
  <Tab.Screen name="Hikayeler" component={StoriesScreen} />
  <Tab.Screen name="Sohbetler" component={ChatStackScreen} options={{ headerShown: false }} />
  {/* <Tab.Screen name="Arkadaşlar" component={FriendsScreen} /> */}
      <Tab.Screen 
        name="Arkadaşlık İstekleri" 
        component={() => userId ? <FriendRequestsScreen userId={userId} /> : null} 
      />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

//yusufcoder@hotmail.com    
//yuuf_557@hotmail.com