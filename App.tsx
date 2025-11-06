import { SafeAreaView } from "react-native";
import Navigation from "./src/Navigation";
import { NavigationContainer } from "@react-navigation/native";


export default function App() {
  return (
      <NavigationContainer >
        <Navigation/>
      </NavigationContainer>
  )

}