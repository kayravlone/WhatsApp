export const listChatRooms = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
    ChatRooms {
      items {
        chatRoom {
          id
          name
          image
          updatedAt
          users {
            items {
              user {
                id
                image
                name
              }
            }
          }
          LastMessage {
            createdAt
            id
            text
          }
        }
      }
    }
  }
  }
`;
