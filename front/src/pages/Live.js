import React, { useState, useEffect } from "react"
import { connect, batch } from "react-redux"
import SideBar from "../components/sidebar"
import SideBarContent from "../components/SideBarContent"
import SocketCL from "../services/socket-service"
import {
    EnterChannelAction,
    RegisterChannelsAction,
    LoadChannelAction,
    RegisterAllChannelsAction,
    SetServerMessageAction,
    RemoveServerMessageAction
} from "../actions/channel-actions"

const Live = (props) => {
    const [isOpen, setOpen] = useState(true)
    const [connection, setConnection] = useState(false)
    let previousWidth = -1

    const updateWidth = () => {
        const width = window.innerWidth
        const widthLimit = 576
        const isMobile = width <= widthLimit
        if (isMobile !== previousWidth <= widthLimit) {
            setOpen(!isMobile)
        }
        previousWidth = width
    }

    useEffect(() => {
        if (!connection) {
            SocketCL.Connect((response) => {
                if (!response.status) {
                    setConnection(false)
                } else {
                    setConnection(true)
                }
            }, props.token)
        }

        updateWidth()
        window.addEventListener("resize", updateWidth)
        return () => {
            window.removeEventListener("resize", updateWidth)
            SocketCL.LeaveChannel()
        }
    }, [])

    const toggle = () => {
        setOpen(!isOpen)
    }

    // Socket Listen
    if (connection) {
        SocketCL.ListenMessage((data) => {
            if (data.meta !== undefined) {
                if (data.meta === "channelcreated") {
                    batch(() => {
                        props.RegisterChannelsAction(data.channel)
                        props.LoadChannelAction(data.channel)
                        props.EnterChannelAction(data.channel)
                    })
                }
                if (data.meta === "newchannel") {
                    const channelFromServer = data.message
                    if (channelFromServer !== null) {
                        props.RegisterChannelsAction(channelFromServer)
                    }
                }
                if (data.meta === "channellist") {
                    const channelsFromServer = data.message
                    props.RegisterAllChannelsAction(channelsFromServer)
                    if (channelsFromServer.length === 0 && props.loadedChannels.length > 0) {
                        window.location.reload(false)
                    }
                }
                if (data.meta === "joinchannel") {
                    const { joint_channel } = data
                    batch(() => {
                        props.RegisterChannelsAction(joint_channel)
                        props.LoadChannelAction(joint_channel)
                        props.EnterChannelAction(joint_channel)
                    })
                }
                if (data.meta === "newmessage") {
                    const { message, uid } = data
                    let channel = props.channels.find((channel) => channel.uid === uid)

                    if (message.sender === "server") {
                        if (message.meta === "join") {
                            channel.participants.push(message.user)
                            ShowServerMessage(props, message.text, channel)
                        }
                        if(message.meta === "leave"){
                            ShowServerMessage(props, message.text, channel)

                            const client = message.user
                            channel.participants = channel.participants.filter((cl) => cl.id !== client.id)
                        }
                    } else {
                        channel.messages.push(message)
                    }

                    if (uid === props.currentChannel.uid) {
                        batch(() => {
                            props.RegisterChannelsAction(channel)
                            props.LoadChannelAction(channel)
                            props.EnterChannelAction(channel)
                        })
                    } else {
                        batch(() => {
                            props.RegisterChannelsAction(channel)
                            props.LoadChannelAction(channel)
                        })
                    }
                }
            }
        })
    }

    const JoinChannel = (channel) => {
        SocketCL.JoinChannel(channel.uid, props.user)
    }

    return (
        <div className="sidebar-wrapper">
            <SideBar toggle={toggle} isOpen={isOpen} JoinChannel={JoinChannel} />
            <SideBarContent toggle={toggle} isOpen={isOpen} />
        </div>
    )
}

const ShowServerMessage = (props, message, channel) => {
    if(!message)return
    if(props.currentChannel.uid === channel.uid){
        props.SetServerMessageAction({message, uid: channel.uid})
        setTimeout(() => {
            props.RemoveServerMessageAction(channel.uid)
        }, 5000)
    }
}

const mapStateToProps = (state) => {
    const { authenticated, token, user } = state.auth || {}
    const { currentChannel, loadedChannels, channels } = state.channel || {}

    return {
        channels,
        loadedChannels,
        currentChannel,
        authenticated,
        token,
        user,
    }
}

const mapDispatchToProps = (dispatch) => ({
    EnterChannelAction: (context) => dispatch(EnterChannelAction(context)),
    RegisterChannelsAction: (context) => dispatch(RegisterChannelsAction(context)),
    LoadChannelAction: (context) => dispatch(LoadChannelAction(context)),
    RegisterAllChannelsAction: (context) => dispatch(RegisterAllChannelsAction(context)),
    SetServerMessageAction: (context) => dispatch(SetServerMessageAction(context)),
    RemoveServerMessageAction: (context) => dispatch(RemoveServerMessageAction(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Live)
