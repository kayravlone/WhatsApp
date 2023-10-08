import { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { onUpdateChatRoom } from "../../graphql/subscriptions";
import ContactListItem from "../../components/ContactListItem";
import { deleteUserChatRoom } from "../../graphql/mutations";

const ChatRoomInfo = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const route = useRoute();
  const [loading, setLoading] = useState(false); // Initialize loading state
  const chatRoomID = route.params.id;
  const navigation = useNavigation();

  const fetchChatRooms = async () => {
    setLoading(true); // Set loading to true when starting the refresh
    const result = await API.graphql(
      graphqlOperation(getChatRoom, { id: chatRoomID })
    );
    setChatRoom(result.data?.getChatRoom);
    setLoading(false); // Set loading to false when the data is fetched
  };

  useEffect(() => {
    fetchChatRooms();
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, {
        filter: { id: { eq: chatRoomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        setChatRoom((cr) => ({
          ...(cr || {}),
          ...value.data.onUpdateChatRoom,
        }));
      },
      error: (error) => console.warn(error),
    });

    return () => subscription.unsubscribe();
  }, [chatRoomID]);

  const removeChatRoomUser = async (chatRoomUser) => {
    const response = await API.graphql(
      graphqlOperation(deleteUserChatRoom, { input: { id: chatRoomUser.id } })
    );
    console.log(response);
  };

  const onContactPress = (chatRoomUser) => {
    Alert.alert(
      "Removing the user",
      `Are you sure you want to remove ${chatRoomUser.user.name} from this group`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeChatRoomUser(chatRoomUser),
        },
      ]
    );
  };

  if (!chatRoom) {
    return <ActivityIndicator />;
  }
  const users = chatRoom.users.items.filter((item) => !item._deleted);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{chatRoom.name}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.sectionTitle}> {users.length} Participants</Text>
        <Text
          onPress={() => navigation.navigate("Add Contacts", { chatRoom })}
          style={{ fontWeight: "bold", color: "royalblue" }}
        >
          Invite Friends
        </Text>
      </View>
      <View style={styles.section}>
        <FlatList
          onRefresh={fetchChatRooms}
          refreshing={loading} // Use the loading state to indicate if a refresh is in progress
          data={users}
          renderItem={({ item }) => (
            <ContactListItem
              user={item.user}
              onPress={() => onContactPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 10,
  },
});

export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
      id
      name
      updatedAt
      users {
        items {
          chatRoomId
          createdAt
          id
          updatedAt
          user {
            id
            image
            name
            status
          }
        }
        nextToken
      }
      updatedAt
      createdAt
      chatRoomLastMessageId
    }
  }
`;

export default ChatRoomInfo;
