import React, { useState, useEffect } from "react"
import { Container, Navbar, Nav } from "react-bootstrap"
import classNames from "classnames"
import { BsChatLeftText } from "react-icons/Bs"
import ChannelTab from "./ChannelTab"
import { connect } from "react-redux"
import MessagePanel from "./MessagePanel"
import SocketCL from "../services/socket-service"

const SideBarContent = (props) => {
    //SOCKET
    const [messages, setMessage] = useState([])

    const InsertMessage = (msg) => {
        setMessage((messages) => [...messages, msg])
    }

    const selectTab = (e) => {
        const currentchannelID = e.target.attributes.index.value
        props.EnterChannelAction(currentchannelID)
    }

    const SendMessage = (e) => {
        e.preventDefault()
        const msg = {
            user: props.user._id,
            message: e.target.message.value,
            meta: null,
            channel: null,
        }
        SocketCL.SendMessage(msg)
        e.target.message.value = ""

        msg.direction = "right"
        InsertMessage(msg)
    }   

    return (
        <Container fluid className={classNames("content", { "is-open": props.isOpen })}>
            <Navbar className="navbar shadow-sm p-3 rounded" expand>
                <button className="siderbar-toggle" onClick={props.toggle}>
                    <BsChatLeftText />
                </button>
                <span className="mx-3">|</span>
                <Navbar.Collapse>
                    {/* {AllChannels &&
                        AllChannels.map((channeltab, i) => {
                            return <ChannelTab channeltab={channeltab} click={selectTab} key={i}/>
                        })} */}
                </Navbar.Collapse>
            </Navbar>
            <MessagePanel/>
        </Container>
    )
}

const mapStateToProps = (state) => {
    const { currentchannelID, loadedChannels, channels } = state.channel || {}
    const { token, user } = state.auth || {}
    return {
        channels,
        loadedChannels,
        currentchannelID,
        token,
        user,
    }
}

const mapDispatchToProps = (dispatch) => ({
    EnterChannelAction: (context) => dispatch(EnterChannelAction(context)),
    RegisterChannelsAction: (context) => dispatch(RegisterChannelsAction(context)),
    LoadChannelAction: (context) => dispatch(LoadChannelAction(context)),
    RegisterAllChannelsAction: (context) => dispatch(RegisterAllChannelsAction(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBarContent)