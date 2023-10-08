import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        backgroundColor: "white",
      },
      root:{
        flex:1
      },
    button:{
        flexDirection:'row',
        alignItems:'center',
        padding:15,
        paddingHorizontal:20,
    },
    icon:{
        marginRight:20,
        backgroundColor:'gainsboro',
        padding:7,
        borderRadius:20,
        overflow:'hidden'
    },
    text:{
        color:'royalblue',
        fontSize:16
    }
})