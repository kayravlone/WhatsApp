import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ChatListItem from "../../components/ChatListItem";
import styles from "./ChatsScreen.style";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { listChatRooms } from "./queries";

const ChatsScreen = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const authUser = await Auth.currentAuthenticatedUser();

      const response = await API.graphql(
        graphqlOperation(listChatRooms, { id: authUser.attributes.sub })
      );
      const rooms = response?.data?.getUser?.ChatRooms?.items.filter(item => !item._deleted);
      const sortedRooms = rooms.sort(
        (room1, room2) =>
          new Date(room2.chatRoom.updatedAt) -
          new Date(room1.chatRoom.updatedAt)
      );
      // Eğer response verisi başarıyla geldiyse ve hatalar yoksa setChatRooms ile veriyi güncelleyin.
      if (response.data && !response.errors) {
        setChatRooms(sortedRooms);
        setLoading(false);
      } else {
        // GraphQL sorgusunda hata varsa veya response boşsa buraya düşecektir.
        console.error("GraphQL sorgusunda hata oluştu veya response boş.");
      }
    } catch (error) {
      // GraphQL sorgusunda veya diğer işlemlerde hata olursa buraya düşecektir.
      console.error("Hata oluştu: ", error);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  return (
    <View style={styles.root}>
      <FlatList
        refreshing={loading}
        data={chatRooms}
        renderItem={({ item }) => <ChatListItem chat={item.chatRoom} />}
        style={styles.container}
        onRefresh={fetchChatRooms}
      />
    </View>
  );
};

export default ChatsScreen;
