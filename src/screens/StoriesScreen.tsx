import React from 'react';
import { View, Text } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const StoriesScreen:React.FC= ()=> {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#121212" }}>
      <Text style={{ color: "#fff" }}>Hikaye Ekranı</Text>
    </SafeAreaView>
  );
}
export default StoriesScreen;