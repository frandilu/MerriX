import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Dimensions,
    Image,
    View,
    Text
} from 'react-native';
import WebView from "react-native-webview"

import Chat from "./Chat"
import Controls from "./Controls"
import ChatIcon from "../img/chat.png"

class Main extends React.Component{
    state={
        video:"https://i.ibb.co/f1j7nwm/Whats-App-Image-2020-04-26-at-16-44-29.jpg",
        // video:"https://1drv.ms/v/s!AhZTJcWAvfGfjkIYQ9NIMHarPTHj",
        isPlay:false,
        duration:"",
        barVisible:false,
        username:(Math.floor(Math.random() * 100) + 1).toString(),
        fullscreen: false,
        pendingChat: 0,
    }

    play = ()=>{
        if(!this.state.isPlay){
            let inject = 'if(document.getElementsByTagName("video")[0]){document.getElementsByTagName("video")[0].play()};true;';
            this.webview.injectJavaScript(inject);
            this.setState({isPlay:true})
        }
    }
    pause = ()=>{
        if(this.state.isPlay){
            let inject = 'if(document.getElementsByTagName("video")){document.getElementsByTagName("video")[0].pause()};true;';
            this.webview.injectJavaScript(inject);
            this.setState({isPlay:false});
        }
    }
    toggleBar = ()=>{
        let inject = ""
        if(this.state.barVisible){
            inject = 'if(document.getElementsByClassName("OneUp-detailsBar")[0]){document.getElementsByClassName("OneUp-detailsBar")[0].setAttribute("hidden","true")};true;';
        }else{
            inject = 'if(document.getElementsByClassName("OneUp-detailsBar")[0]){document.getElementsByClassName("OneUp-detailsBar")[0].removeAttribute("hidden","true")};true;';
        }
        this.setState({barVisible:!this.state.barVisible})
        this.webview.injectJavaScript(inject);
    }
    toggleFullscreen = ()=>{
        this.setState({fullscreen:!this.state.fullscreen})
        this.setState({pendingChat:0})
        }
    addPendingChat = ()=>{
        this.setState({pendingChat:this.state.pendingChat += 1})
        }
    rewind = (s)=>{
        let inject = 'if(document.getElementsByTagName("video")[0]){document.getElementsByTagName("video")[0].currentTime -= ' + (s * 60) + "}; true;";
        this.webview.injectJavaScript(inject);
        }
    forward = (s)=>{
        let inject = 'if(document.getElementsByTagName("video")[0]){document.getElementsByTagName("video")[0].currentTime += ' + (s * 60) + "}; true;";
        this.webview.injectJavaScript(inject);
        }
    setTime = (s)=>{
        let inject = 'if(document.getElementsByTagName("video")[0]){document.getElementsByTagName("video")[0].currentTime = ' + (s * 60) + "}; true;";
        this.webview.injectJavaScript(inject);
        }
    setTimeH = (s)=>{
        let inject = 'if(document.getElementsByTagName("video")[0]){document.getElementsByTagName("video")[0].currentTime = ' + (s*3600) + "}; true;";
        this.webview.injectJavaScript(inject);
        }
    redirect = (r)=>{
        let newURL = r;
        let redirectTo = 'window.location = "' + newURL + '"; true;';
        this.webview.injectJavaScript(redirectTo);
    }
    changeUsername = (user) => {
        console.log(user)
        this.setState({username:user})
    }

    commands = ['document.getElementsByClassName("od-PlaybackPanel-buttons")[0].setAttribute("hidden","true");',
    'document.getElementsByClassName("od-PlaybackPanel-bottom")[0].style.height = "20px";',
    'document.getElementsByClassName("OneUp-commandBar")[0].remove();',
    'document.getElementsByClassName("od-Files-unauthBanner")[0].remove();',
    'document.getElementsByClassName("od-BasePage-suiteNav")[0].remove();',
    'document.getElementsByClassName("od-BasePage-topBar")[0].remove();',
    'document.getElementsByClassName("od-Files-oneUp od-Files-OneUp--showUnauthBanner")[0].style.top = 0;',
    'document.getElementsByClassName("od-BasePage-belowHeader od-BasePage-belowHeader--flexbox")[0].style.top = 0;',
    'document.getElementsByClassName("OneUp-content")[0].style.top = 0;',
    'document.getElementsByClassName("od-VideoPlayer-canvas")[0].style.background = "#333";',
    'document.getElementsByClassName("od-PlaybackPanel")[0].style.background = "rgba(100,100,100,.60)";',
    'document.getElementsByClassName("od-PlaybackPanel-timePlayed")[0].style.color = "#fff";',
    'document.getElementsByClassName("od-PlaybackPanel-totalTime")[0].style.color = "#fff";',
]
    
    
    
    removeVideoFrame = ()=>{
        this.commands.map(command=>{
            const inject = command + `
            true;`;
            this.webview.injectJavaScript(inject);
        })
    }

    onMessage = ()=>{
        this.removeVideoFrame()
    }

    onLoadEnd = ()=>{
        let inject = `
        let int = setInterval( ()=>{
            if(document.getElementsByClassName("od-PlaybackPanel-buttons")[0]){
                window.ReactNativeWebView.postMessage("a")
                clearInterval(int);
            }
        },500)
        let int2 = setInterval( ()=>{
            if(document.getElementsByTagName("video")[0].duration){
                window.ReactNativeWebView.postMessage("a")
                clearInterval(int2);
            }
        },500)

        true;`;
        this.webview.injectJavaScript(inject);
    }

    webStyle = ()=>{
        if(this.state.fullscreen){
            return{
                position:"relative",
                width: Dimensions.get("window").height,
                height: Dimensions.get("window").width,
                minHeight: Dimensions.get("window").width,
                maxHeight: Dimensions.get("window").width,
                margin:0,
                padding:0,
                zIndex:5,
                elevation:5,
            }
        } else {
            return{
                position:"absolute",
                minHeight: Dimensions.get("window").width * 0.5625,
                maxHeight: Dimensions.get("window").width * 0.5625,
                height: Dimensions.get("window").width * 0.5625,
                width:Dimensions.get("window").width,
                margin:0,
                padding:0,
                zIndex:1,
            }
        }
    }

    
    playerContainer = ()=>{
        if(this.state.fullscreen){
            return{
                position:"relative",
                width:"100%",
                height:"100%",
                justifyContent:"center",
                alignItems:"center",
                transform:[{rotate:"90deg"}],
                zIndex:250,
                elevation:250
            }
        } else {
            return{
                position:"relative",                
                minHeight: Dimensions.get("window").width * 0.5625,
                maxHeight: Dimensions.get("window").width * 0.5625,
                height: Dimensions.get("window").width * 0.5625,
                width: Dimensions.get("window").width,
                zIndex:250,
                elevation:250
            }
        }
    }


    webContainer = ()=>{
        if(this.state.fullscreen){
            return{
                position:"absolute",
                width:Dimensions.get("window").height,
                height:Dimensions.get("window").width,
                zIndex:250,
                elevation:250
            }
        } else {
            return{
                position:"absolute",                
                minHeight: Dimensions.get("window").width * 0.5625,
                maxHeight: Dimensions.get("window").width * 0.5625,
                height: Dimensions.get("window").width * 0.5625,
                width: Dimensions.get("window").width,
                zIndex:250,
                elevation:250
            }
        }
    }

    render(){
    return (
        <>
        {
            this.state.fullscreen ?
            <StatusBar hidden />
            :
            <StatusBar barStyle="dark-content" />
        }
        <SafeAreaView style={this.styles.container}>
            <Chat
            username={this.state.username}
            changeUsername={this.changeUsername}
            removeVideoFrame={this.removeVideoFrame} 
            toggleBar={this.toggleBar} 
            rewind={this.rewind} 
            forward={this.forward} 
            setTime={this.setTime} 
            setTimeH={this.setTimeH} 
            redirect={this.redirect}
            play={this.play} 
            pause={this.pause}
            fullscreen={this.state.fullscreen}
            addPendingChat={this.addPendingChat}
            />
            <View style={this.playerContainer()}>
                <View style={this.webContainer()}>
                    <WebView 
                    ref={ref => this.webview = ref}
                    source={{ uri: this.state.video }} 
                    style={this.webStyle()}
                    onLoadEnd={this.onLoadEnd}
                    mediaPlaybackRequiresUserAction={false}
                    allowsFullscreenVideo={true}
                    onMessage={()=>this.onMessage()}
                    onNavigationStateChange={this.onLoadEnd}
                    automaticallyAdjustContentInsets={false}
                    />
                </View>
                <Controls 
                removeVideoFrame={this.removeVideoFrame} 
                toggleBar={this.toggleBar} 
                isPlay={this.state.isPlay}
                barVisible={this.state.barVisible}
                username={this.state.username}
                toggleFullscreen={this.toggleFullscreen}
                fullscreen={this.state.fullscreen}
                />
            </View>
            {
                this.state.pendingChat ?
                <View style={this.styles.chatContainer}>
                    <Image style={this.styles.chat} source={ChatIcon} />
                    <Text style={this.styles.chatCounter}>{this.state.pendingChat}</Text>
                </View>
                :
                null
            }
        </SafeAreaView>
        </>
    )
    }

    styles = StyleSheet.create({
    container:{
        backgroundColor:"#333",
        width:Dimensions.get("window").width,
        height:Dimensions.get("window").height,
    },
    chatContainer:{
        position:"absolute",
        bottom:40,
        right:20,
        height:50,
        width:50,
        transform:[{rotate:"90deg"}],
        textAlign:"center",
        justifyContent:"center",
        alignItems:"center",
        zIndex:500,
        elevation:500
    },
    chat:{
        height:50,
        width:50,
        position:"absolute",
        backgroundColor:"#333",
        borderRadius:10,
    },
    chatCounter:{
        marginBottom:7,
        color:"#fff",
        backgroundColor:"#e55",
        borderRadius:10,
        paddingHorizontal:5
    }
    });


}

export default Main;
