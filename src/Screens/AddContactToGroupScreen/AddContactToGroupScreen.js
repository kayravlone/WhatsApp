import { View, Text, FlatList, Button, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import ContactListItem from "../../components/ContactListItem";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createChatRoom, createUserChatRoom } from "../../graphql/mutations";
import { listUsers } from "../../graphql/queries";
import styles from "./AddContactToGroupScreen.style";
import { useNavigation, useRoute } from "@react-navigation/native";

const AddcontactToGroupScreen = () => {
  const [users, setUsers] = useState([]);
  const route = useRoute();
  const chatRoom = route.params.chatRoom;
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    API.graphql(graphqlOperation(listUsers)).then((result) => {
      setUsers(
        result.data?.listUsers?.items.filter(
          (item) =>
            !chatRoom.users.items.some(
              (chatRoomUser) => !chatRoomUser._deleted && item.id === chatRoomUser.userID
            ) 
        )
      );
    });
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Add t group"
          disabled={selectedUserIds.length < 1}
          onPress={onAddToGroupPress}
        />
      ),
    });
  }, [selectedUserIds]);
  const onAddToGroupPress = async () => {
    // Check if we already have a ChatRoom with user
    await Promise.all(
      selectedUserIds.map((userId) =>
        API.graphql(
          graphqlOperation(createUserChatRoom, {
            input: { chatRoomId: chatRoom.id, userId },
          })
        )
      )
    );
    // Add the auth user to the ChatRoom

    setSelectedUserIds([]);

    // navigate to the newly created ChatRoom
    navigation.goBack();
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

export default AddcontactToGroupScreen;
