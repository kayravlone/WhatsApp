import {
  View,
  Text,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import bg from "../../../assets/images/BG.png";
import Message from "../../components/Message";
import styles from "./ChatScreen.style";
import InputBox from "../../components/InputBox";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API, graphqlOperation } from "aws-amplify";
import { getChatRoom, listMessagesByChatRoom } from "../../graphql/queries";
import { onCreateMessage, onUpdateChatRoom } from "../../graphql/subscriptions";
import { Feather } from "@expo/vector-icons";
const ChatScreen = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const route = useRoute();
  const navigation = useNavigation();
  const chatroomID = route.params.id;

  useEffect(() => {
    API.graphql(graphqlOperation(getChatRoom, { id: chatroomID })).then(
      (result) => setChatRoom(result.data?.getChatRoom)
    );
    const subscription = API.graphql(
      graphqlOperation(onUpdateChatRoom, { filter: { id: { eq: chatroomID } } })
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
  }, [chatroomID]);

  useEffect(() => {
    API.graphql(
      graphqlOperation(listMessagesByChatRoom, {
        chatroomID,
        sortDirection: "DESC",
      })
    ).then((result) => {
      setMessages(result.data?.listMessagesByChatRoom?.items);
    });

    const subscription = API.graphql(
      graphqlOperation(onCreateMessage, {
        filter: { chatroomID: { eq: chatroomID } },
      })
    ).subscribe({
      next: ({ value }) => {
        setMessages((m) => [value.data.onCreateMessage, ...m]);
      },
      error: (error) => console.warn(error),
    });
    return () => subscription.unsubscribe();
  }, [chatroomID]);

  useEffect(() => {
    navigation.setOptions({
      title:  route.params.name  ,
      headerRight: () => (
        <Feather onPress={() => navigation.navigate("Group Info", {id : chatroomID})} name="more-vertical" size={24} color="gray" />
      ),
    });
  }, [route.params.name,chatroomID]);

  if (!chatRoom) {
    return <ActivityIndicator />; 
  }

  return (
    <ImageBackground source={bg} style={styles.bg}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <Message message={item} />}
        style={styles.list}
        inverted
      />
      <InputBox chatroom={chatRoom} />
    </ImageBackground>
  );
};

export default ChatScreen;
