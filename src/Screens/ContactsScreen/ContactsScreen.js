import { View, Text, FlatList, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import ContactListItem from "../../components/ContactListItem";
import { listUsers } from "../../graphql/queries";
import styles from "./ContactsScreen.style";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";
import { getCommonChatRoomWithUser } from "../../services/chatRoomService";

const ContactsScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);
  const createAChatRoomWithTheUser = async (user) => {
    // Check if we already have a ChatRoom with user
    const existingChatRoom = await getCommonChatRoomWithUser(user.id);
    if (existingChatRoom) {
      navigation.navigate("Chat", { id: existingChatRoom.chatRoom.id });
      return;
    }

    // Create a new Chatroom
    try {
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, { input: {} })
      );
      console.log(newChatRoomData);
      if (!newChatRoomData.data?.createChatRoom) {
        console.log("Error creating the chat error");
      }
      const newChatRoom = newChatRoomData.data?.createChatRoom;

      // Add the clicked user to the ChatRoom
      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: { chatRoomId: newChatRoom.id, userId: user.id },
        })
      );

      // Add the auth user to the ChatRoom
      const authUser = await Auth.currentAuthenticatedUser();
      await API.graphql(
        graphqlOperation(createUserChatRoom, {
          input: {
            chatRoomId: newChatRoom.id,
            userId: authUser.attributes.sub,
          },
        })
      );

      // navigate to the newly created ChatRoom
      navigation.navigate("Chat", { id: newChatRoom.id });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            user={item}
            onPress={() => createAChatRoomWithTheUser(item)}
          />
        )}
        style={styles.container}
        ListHeaderComponent={() => (
          <Pressable
            onPress={() => {
              navigation.navigate("New Group");
            }}
            style={styles.button}
          >
            <MaterialIcons
              name="group"
              size={24}
              color="royalblue"
              style={styles.icon}
            />
            <Text style={styles.text}>New Group</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default ContactsScreen;
