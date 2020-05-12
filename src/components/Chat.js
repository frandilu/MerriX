import React from "react"

import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TouchableNativeFeedback,
    TextInput,
    Keyboard,
    Dimensions,
    Image
} from "react-native"

import io from "socket.io-client"

var _keyboardWillShowSubscription;
var _keyboardWillHideSubscription;

import Background from "../img/background.jpg"

class Chat extends React.Component{
    state = {
        input:"",
        keyboardHeight: Dimensions.get("window").height-(Dimensions.get("window").width * 0.5625),
        chatMessages:[],
    }
    
    _keyboardWillShow(e) {
        this.setState({keyboardHeight: (Dimensions.get("window").height-(Dimensions.get("window").width * 0.5625)) - e.endCoordinates.height});
    }
    _keyboardWillHide(e) {
        this.setState({keyboardHeight: Dimensions.get("window").height-(Dimensions.get("window").width * 0.5625)});
    }
    
    componentDidMount() {
        _keyboardWillShowSubscription = Keyboard.addListener('keyboardDidShow', (e) => this._keyboardWillShow(e));
        _keyboardWillHideSubscription = Keyboard.addListener('keyboardDidHide', (e) => this._keyboardWillHide(e));
        
        this.scrollView.scrollToEnd()
    
        this.socket = io("https://merrix-api.herokuapp.com");
        this.socket.on("chat message", msg => {
            this.checkCommand(msg)
        });
    }
    componentWillUnmount() {
        _keyboardWillShowSubscription.remove();
        _keyboardWillHideSubscription.remove();
    }


    bottomStyle(){
        if(this.props.fullscreen){
            return {
                position:"absolute",
                top:Dimensions.get("window").width * 0.5625,
                width:Dimensions.get("window").width,
                height:this.state.keyboardHeight,
                backgroundColor:"#333",
                paddingBottom:30,
                zIndex:0,
                elevation:0
            }
        }
        return {
            position:"absolute",
            top:Dimensions.get("window").width * 0.5625,
            width:Dimensions.get("window").width,
            height:this.state.keyboardHeight,
            backgroundColor:"#333",
            paddingBottom:30,
            zIndex:2,
            elevation:2
        }
    }
    

    checkCommand(msg){
        if(msg[1][0] == "/"){
            if(msg[1].startsWith("/pause")){
                this.props.pause()
            }
            else if (msg[1].startsWith("/play")){
                this.props.play()
            }
            else if(msg[1].startsWith("/view")){
                this.props.redirect(msg[1].replace("/view ",""))
            }
            else if(msg[1].startsWith("/toggleBar")){
                this.props.toggleBar()
            }
            else if(msg[1].startsWith("/rewind")){
                let rewindTime = msg[1].replace("/rewind ","")
                this.props.rewind(rewindTime)
            }
            else if(msg[1].startsWith("/forward")){
                let forwardTime = msg[1].replace("/forward ","")
                this.props.forward(forwardTime)
            }
            else if(msg[1].startsWith("/setTime")){
                let setTime = msg[1].replace("/setTime ","")
                this.props.setTime(setTime)
            }
            else if(msg[1].startsWith("/setTimeH")){
                let setTime = msg[1].replace("/setTimeH ","")
                this.props.setTime(setTime)
            }
            else if(msg[1].startsWith("/removeVideoFrame")){
                this.props.removeVideoFrame()
            }
            else if(msg[1].startsWith("/username") && msg[0] == this.props.username){
                this.props.changeUsername(msg[1].replace("/username ",""))
            }
        }
        else{
            this.setState({ chatMessages: [...this.state.chatMessages, msg]});
            if(this.props.fullscreen && msg[0] != this.props.username){
                this.props.addPendingChat()
            }
        }
    }

    submit(msg){
        if(msg[1] != ""){
            if(msg[1].startsWith("/self ")){
                let selfM = msg[1].replace("self ","")
                this.checkCommand([this.props.username ,selfM])
                this.setState({input:""})
                return
            }
            this.setState({input:""})
            this.socket.emit('chat message',msg)
        }
    }
    
    render(){
        return <View style={this.bottomStyle()}> 
        <View style={this.styles.backgroundContainer}>
            <Image style={this.styles.backgroundImage} source={Background} />
        </View>
            <ScrollView
            ref={ref => {this.scrollView = ref}}
            onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
            style={this.styles.container}>
                {
                    this.state.chatMessages.map(message => {
                        if(message[0] != this.props.username){
                            return(
                                <View key={message[1]+(new Date().getMilliseconds())} style={this.styles.other}>
                                <Text style={this.styles.user}>{message[0]}</Text>
                                <Text style={this.styles.message}>{message[1]}</Text>
                            </View>
                            )
                        }else{
                            return(
                                <View key={message[1]+(new Date().getMilliseconds())} style={this.styles.self}>
                                <Text style={this.styles.user}>{message[0]}</Text>
                                <Text style={this.styles.message}>{message[1]}</Text>
                            </View>
                            )
                        }
                    })
                }
            </ScrollView>
            {
                this.props.fullscreen ?
                null
                :
                <View style={this.styles.input}>
                    <TextInput
                        style={this.styles.inputText}
                        onChangeText={text => this.setState({input:text})}
                        value={this.state.input}
                        placeholder={"Mensajito"}
                        placeholderTextColor={"#777"}
                    />
                    <View style={this.styles.buttonContainer}>
                    <TouchableNativeFeedback
                    onPress={()=>this.submit([this.props.username,this.state.input])}>
                        <View
                        style={this.styles.sendButton}>
                            <Image
                            style={this.styles.sendArrow}
                            source={require('../img/sendArrow.png')}
                            />
                        </View>
                    </TouchableNativeFeedback>
                    </View>
                </View>
            }
        </View>
    }

    styles = StyleSheet.create({
        container:{
            height:"93%",
            position:"relative",
            zIndex:200,
            elevation:200,
        },
        backgroundContainer:{
            position:"absolute",
            top:0,
            right:0,
            left:0,
            bottom:0,
            zIndex:100,
            elevation:100,
            width: Dimensions.get("window").width,
            height: "100%",
            justifyContent:"center",
            alignItems:"center",
            overflow:"hidden",
        },
        backgroundImage:{
            width:300,
            height:300,
        },
        other:{
            width:"100%",
            marginBottom:10,
            textAlign: "left",
            alignItems:"flex-start"
        },
        self:{
            width:"100%",
            marginBottom:10,
            textAlign: "left",
            alignItems:"flex-end",
            paddingRight:20,
        },
        user:{
            color:"#777",
            fontSize:15,
            paddingHorizontal:15,
        },
        message:{
            paddingVertical:10,
            maxWidth: Dimensions.get("window").width * .7,
            paddingHorizontal:15,
            backgroundColor:"#222",
            color:"#eee",
            borderRadius:10,
            fontSize:20,
        },
        input:{
            flexDirection:"row",
            position:"relative",
            zIndex:200,
            elevation:200,
        },
        inputText:{
            height:50,
            width: Dimensions.get("window").width -70,
            backgroundColor:"#222",
            borderWidth: 1,
            borderRadius:90,
            paddingLeft:20,
            color:"#eee",
        },
        buttonContainer:{
            height:50,
            width:50,
            overflow:"hidden",
            borderRadius:50,
            marginLeft:10,
        },
        sendButton:{
            height:50,
            width:50,
            backgroundColor:"#222",
            borderRadius:50,
            justifyContent:"center",
            alignItems:"center",
            borderColor:"#000",
            borderWidth:1,
        },
        sendArrow:{
            height:25,
            width:25,
            
        }
    })
    
}

export default Chat