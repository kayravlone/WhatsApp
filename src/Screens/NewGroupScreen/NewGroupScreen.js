import { View, Text, FlatList, Button, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import ContactListItem from "../../components/ContactListItem";
import { API, graphqlOperation,Auth } from "aws-amplify";
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";
import { listUsers } from "../../graphql/queries";
import styles from "./NewGroupScreen.style";
import { useNavigation } from "@react-navigation/native";

const NewGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(result.data?.listUsers?.items);
    });
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Create"
          disabled={!name || selectedUserIds.length < 1}
          onPress={onCreateGroupPress}
        />
      ),
    });
  }, [name, selectedUserIds]);
  const onCreateGroupPress = async () => {
    // Check if we already have a ChatRoom with user

    // Create a new Chatroom
    try {
      const newChatRoomData = await API.graphql(
        graphqlOperation(createChatRoom, { input: { name } })
      );
      console.log(newChatRoomData);
      if (!newChatRoomData.data?.createChatRoom) {
        console.log("Error creating the chat error");
      }
      const newChatRoom = newChatRoomData.data?.createChatRoom;

      await Promise.all(
        selectedUserIds.map((userId) =>
          API.graphql(
            graphqlOperation(createUserChatRoom, {
              input: { chatRoomId: newChatRoom.id, userId },
            })
          )
        )
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
        setSelectedUserIds([])
        setName("")
      // navigate to the newly created ChatRoom
      navigation.navigate("Chat", { id: newChatRoom.id });
    } catch (error) {
      console.log(error);
    }
  };
  const onContactPress = (id) => {
    setSelectedUserIds((userIds) => {
      if (userIds.includes(id)) {
        return [...userIds].filter((uid) => uid !== id);
      } else {
        return [...userIds, id];
      }
    });
  };
  return (
    <View>
      <View style={styles.container}></View>
      <TextInput
        placeholder="Group Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <ContactListItem
            user={item}
            selectable
            onPress={() => onContactPress(item.id)}
            isSelected={selectedUserIds.includes(item.id)}
          />
        )}
      />
    </View>
  );
};

export default NewGroupScreen;
