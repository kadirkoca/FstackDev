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
    RegisterUserAction,
    RegisterMessageAction,
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
                    const channel = props.loadedChannels.find((channel) => channel.uid === uid)
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

                    if (message.sender === "server") {
                        if (message.meta === "join") {
                            props.SetServerMessageAction(message.text)

                            setTimeout(() => {
                                props.SetServerMessageAction("")
                            }, 5000)
                        }
                    } else {
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
    RegisterUserAction: (context) => dispatch(RegisterUserAction(context)),
    RegisterMessageAction: (context) => dispatch(RegisterMessageAction(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Live)
