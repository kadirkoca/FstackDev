import React, { useState, useEffect } from "react"
import { Container, Row, Col, Navbar, Button, Nav } from "react-bootstrap"
import { connect } from "react-redux"
import dataService from "../services/data-service"
import Toast from "../components/Toast"
import Spinner from "../components/Spinner"
import SideBar from "../components/sidebar"
import SideBarContent from "../components/SideBarContent"
import SocketCL from "../services/socket-service"
import {
    EnterChannelAction,
    RegisterChannelsAction,
    LoadChannelAction,
    RegisterAllChannelsAction
} from "../actions/channel-actions"

const Live = (props) => {
    const [isOpen, setOpen] = useState(true)
    const [currentChannel, setCurrentChannel] = useState(null)
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
                    ListenSocket()
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

    const ListenSocket = () => {
        SocketCL.ListenMessage((data) => {
            if (data.meta !== undefined) {
                if (data.meta === "channelcreated") {
                    props.EnterChannelAction(data.channel.uid)
                    props.LoadChannelAction(data.channel)
                    props.RegisterChannelsAction(data.channel)
                }
                if (data.meta === "channellist") {
                    const channelsFromServer = data.message
                    if (channelsFromServer.length > 0) {
                        props.RegisterAllChannelsAction(channelsFromServer)
                    }
                }
                if (data.meta === "joinchannel") {
                    const sik = props.channels
                    console.log(sik)
                    const messages = data.messages
                    const channel = props.channels.find((channel) => channel.uid === data.uid)
                    const person = channel.participants.find((person) => person.id === data.user.id)
                    if(!person){
                        channel.participants.push(data.user)
                    }
                    if (messages.length > 0) {
                        channel.messages = [...channel.messages, ...messages]
                    }
                }                
                if (data.meta === "newmessage") {
                    const channel = props.loadedChannels.find((channel) => channel.uid === uid)
                    if (!channel) {
                        channel.messages.push(message)
                    }
                }
            }
        })
    }

    const JoinChannel = (channel) => {
        const messagecount = channel.messages.length
        const channeluid = channel.uid
        SocketCL.JoinChannel(channeluid, messagecount, props.user)
        setCurrentChannel(channel)
    }

    return (
        <div className="sidebar-wrapper">
            <SideBar toggle={toggle} isOpen={isOpen} JoinChannel={JoinChannel} />
            <SideBarContent toggle={toggle} isOpen={isOpen} currentChannel={currentChannel}/>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { authenticated, token, user } = state.auth || {}
    const { currentchannelID, loadedChannels, channels } = state.channel || {}

    return {
        channels,
        loadedChannels,
        currentchannelID,
        authenticated,
        token,
        user
    }
}

const mapDispatchToProps = (dispatch) => ({
    EnterChannelAction: (context) => dispatch(EnterChannelAction(context)),
    RegisterChannelsAction: (context) => dispatch(RegisterChannelsAction(context)),
    LoadChannelAction: (context) => dispatch(LoadChannelAction(context)),
    RegisterAllChannelsAction: (context) => dispatch(RegisterAllChannelsAction(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Live)
