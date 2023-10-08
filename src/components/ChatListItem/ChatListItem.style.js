import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection:'row',
    marginHorizontal:10,
    marginVertical:5,
    height:70
  },
  image: {
    width: 60,
    height: 60,
    borderRadius:30,
    marginRight:10
  },
  content: {
    flex:1,
    borderBottomWidth: StyleSheet.hairlineWidth ,
    borderBottomColor:'gray'
  },
  row: {
    flexDirection:'row',
    marginBottom:5
  },
  name: {
    flex:1,
    fontWeight:'bold'
  },
  subTitle: {
    color:'gray',
    
  },
});
