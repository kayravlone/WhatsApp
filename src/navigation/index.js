import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, createStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChatScreen from "../Screens/ChatScreen";
import ContactScreen from '../Screens/ContactsScreen';
import MainTabNavigator from "../navigation/MainTabNavigator";
import NewGroupScreen from "../Screens/NewGroupScreen/NewGroupScreen";
import GroupInfoScreen from "../Screens/GroupInfoScreen/GroupInfoScreen";
import AddcontactToGroupScreen from "../Screens/AddContactToGroupScreen/AddContactToGroupScreen";
const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor:'whitesmoke'}}} >
        <Stack.Screen name="Home" component={MainTabNavigator}  options={{headerShown:false}} />
        <Stack.Screen name="Chat" component={ChatScreen}  />
        <Stack.Screen name="Group Info" component={GroupInfoScreen}  />
        <Stack.Screen name="Contacts" component={ContactScreen} />
        <Stack.Screen name="New Group" component={NewGroupScreen} />
        <Stack.Screen name="Add Contacts" component={AddcontactToGroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
