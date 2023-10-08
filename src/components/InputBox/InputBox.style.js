import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container:{
        flexDirection:'row',
        backgroundColor:'whitesmoke',
        padding:5,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:10
    },
    input:{
        flex:1,
        backgroundColor:'white',
        padding:5,
        borderRadius:50,
        paddingHorizontal:10,
        borderColor:'lightgray',
        borderWidth:StyleSheet.hairlineWidth,
        marginHorizontal:10,
        marginBottom:20,
        alignItems:'center',
        justifyContent:'center'
        
    },
    send:{
        backgroundColor:'royalblue',
        padding:7,
        borderRadius:15,
        justifyContent:'center',
        alignSelf:'center',
        overflow:'hidden',
        marginBottom:20
    },    
    plus:{
        marginBottom:20
    }
})