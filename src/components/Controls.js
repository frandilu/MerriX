import React from "react"

import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text
} from "react-native"

import SuperRewind from "../img/superRewindButton.png"
import Rewind from "../img/rewindButton.png"
import SuperForward from "../img/superForwardButton.png"
import Forward from "../img/forwardButton.png"
import Play from "../img/playButton.png"
import Pause from "../img/pauseButton.png"
import exitFullscreen from "../img/exitFullscreen.png"
import fullscreen from "../img/fullscreen.png"

import io from "socket.io-client"

class Controls extends React.Component{
    sendCommand(command){
        this.socket.emit("chat message",[this.props.username+ 1,command])
    }

    componentDidMount(){
        this.socket = io("https://merrix-api.herokuapp.com");
    }

    
    controls = ()=>{
        if(this.props.fullscreen){
            return{
                position:"absolute",
                // minHeight: Dimensions.get("window").width * 0.5625,
                // maxHeight: Dimensions.get("window").width * 0.5625,
                width: Dimensions.get("window").height,
                height:Dimensions.get("window").width,
                margin:0,
                padding:0,
                zIndex:300,
                elevation:300,
                backgroundColor:"rgba(0,0,0,.5)",
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"row",
                opacity: this.props.barVisible ? 1 : 0
            }
        } else {
            return{
                position:"absolute",
                // minHeight: Dimensions.get("window").width * 0.5625,
                // maxHeight: Dimensions.get("window").width * 0.5625,
                height: Dimensions.get("window").width * 0.5625,
                width:Dimensions.get("window").width,
                backgroundColor:"rgba(0,0,0,.5)",
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"row",
                margin:0,
                padding:0,
                zIndex:300,
                elevation:300,
                opacity: this.props.barVisible ? 1 : 0
            }
        }
    }

    overlay = ()=>{
        if(this.props.fullscreen){
            return{
                position:"absolute",
                // top:"25%",
                // left:"-50%",
                width: Dimensions.get("window").height,
                height:Dimensions.get("window").width,
                // minHeight: Dimensions.get("window").width * 0.5625,
                // maxHeight: Dimensions.get("window").width * 0.5625,
                zIndex: this.props.barVisible ? 310 : 500,
                elevation:this.props.barVisible ? 310 : 500,
            }
        } else {
            return{
                position:"absolute",
                zIndex: this.props.barVisible ? 310 : 500,
                elevation:this.props.barVisible ? 310 : 500,
                height: Dimensions.get("window").width * 0.5625,
                width:Dimensions.get("window").width,
            }
        }
    }

    fullscreen = ()=>{
        if(this.props.fullscreen){
            return{
                position:"absolute",
                bottom:0,
                left:Dimensions.get("window").height / 2 - 40,
                width:40,
                height:40,
                overflow:"hidden",
                justifyContent:"center",
                alignItems:"center",
                margin:20,
                zIndex:400,
                elevation:400,
            }
        } else {
            return{
                position:"absolute",
                bottom:0,
                right:0,
                width:40,
                height:40,
                overflow:"hidden",
                justifyContent:"center",
                alignItems:"center",
                margin:20,
                zIndex:400,
                elevation:400,
            }
        }
    }


    render(){
        return (
            <View style={this.controls()}>
                <View style={this.styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={()=>this.sendCommand("/rewind 20")}
                    >
                        <Image style={this.styles.button} source={SuperRewind} />
                    </TouchableOpacity>
                </View>
                <View style={this.styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={()=>this.sendCommand("/rewind 1")}
                    >
                        <Image style={this.styles.button} source={Rewind} />
                    </TouchableOpacity>
                </View>
                {
                    this.props.isPlay ?                
                    <View style={this.styles.buttonContainer}>
                        <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={()=>this.sendCommand("/pause")}
                        >
                            <Image style={this.styles.button} source={Pause} />
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={this.styles.buttonContainer}>
                        <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={()=>this.sendCommand("/play")}
                        >
                            <Image style={this.styles.button} source={Play} />
                        </TouchableOpacity>
                    </View>
                }
                <View style={this.styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={()=>this.sendCommand("/forward 1")}
                    >
                        <Image style={this.styles.button} source={Forward} />
                    </TouchableOpacity>
                </View>
                <View style={this.styles.buttonContainer}>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={()=>this.sendCommand("/forward 20")}
                    >
                        <Image style={this.styles.button} source={SuperForward} />
                    </TouchableOpacity>
                </View>
                <View style={this.fullscreen()}>
                    <TouchableOpacity
                        activeOpacity={0.3}
                        onPress={this.props.toggleFullscreen}
                    >
                        {
                            this.props.fullscreen ? 
                            <Image style={this.styles.fsButton} source={exitFullscreen} />
                            :
                            <Image style={this.styles.fsButton} source={fullscreen} />
                        }
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                onPress={this.props.toggleBar}
                style={this.overlay()}
                />
            </View>
        )
    }
    
    styles = StyleSheet.create({
        buttonContainer:{
            position:"relative",
            width:40,
            height:40,
            overflow:"hidden",
            justifyContent:"center",
            alignItems:"center",
            margin:20,
            zIndex:400,
            elevation:400,
        },
        button:{
            width:40,
            height:40,
        },
        fsButton:{
            width:30,
            height:30,
        }
    })
}

export default Controls