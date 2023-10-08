import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import styles from "./InputBox.style";
import { SafeAreaView } from "react-native-safe-area-context";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { createMessage, updateChatRoom } from "../../graphql/mutations";

const InputBox = ({ chatroom }) => {
  const [text, setText] = useState("");

  const onSend = async () => {
    console.warn("Send", text);
    const authUser = await Auth.currentAuthenticatedUser();

    const newMessage = { chatroomID:chatroom.id, text, userID: authUser.attributes.sub };
    const newMessageData =  await API.graphql(graphqlOperation(createMessage, { input: newMessage }));
    console.log('hi')
    console.log(newMessage.userID)
    setText("");

    await API.graphql(
      graphqlOperation(updateChatRoom, {
        input: { chatRoomLastMessageId: newMessageData.data?.createMessage?.id, id: chatroom.id },
      })
    );
  };
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <AntDesign name="plus" size={20} color="royalblue" style={styles.plus} />

      <TextInput
        value={text}
        onChangeText={setText}
        style={styles.input}
        placeholder="Type your message..."
      />

      <MaterialIcons
        onPress={onSend}
        style={styles.send}
        name="send"
        size={16}
        color="white"
      />
    </SafeAreaView>
  );
};

export default InputBox;
