import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NotImplementedScreen from "../Screens/NotImplementedScreen";
import ChatsScreen from "../Screens/ChatsScreen";
import SettingsScreen from "../Screens/Settings/SettingsScreen";
import { Ionicons, Entypo } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Chats" 
      screenOptions={{
        headerStyle: {
          backgroundColor: "whitesmoke", // TabBar'ın arka plan rengini burada ayarlayabilirsiniz
        },
        tabBarStyle: {
          backgroundColor: "whitesmoke", // Her sekmenin arka plan rengini burada ayarlayabilirsiniz
        },
        activeTintColor: "royalblue", // Aktif sekme rengini burada ayarlayabilirsiniz
      }}
    >
      <Tab.Screen
        name="Status"
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="logo-whatsapp" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calls"
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={NotImplementedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
        }}
      />
     <Tab.Screen
  name="Chats"
  component={ChatsScreen}
  options={({ navigation }) => ({
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="ios-chatbubbles-sharp" size={size} color={color} />
    ),
    
    headerRight: () => (
      <Entypo
        onPress={() => navigation.navigate("Contacts")}
        name="new-message"
        size={18}
        color={"royalblue"}
        style={{ marginRight: 15 }}
      />
    ),
  })}
/>

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
