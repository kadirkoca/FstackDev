import React, { useState, useEffect } from "react"
import { Container, Navbar, Nav } from "react-bootstrap"
import classNames from "classnames"
import { BsChatLeftText } from "react-icons/Bs"
import ChannelTab from "./ChannelTab"
import { connect } from "react-redux"
import MessagePanel from "./MessagePanel"
import SocketCL from "../services/socket-service"
import { EnterChannelAction } from "../actions/channel-actions"

const SideBarContent = (props) => {
    const channel = props.currentChannel

    const SendMessage = (e) => {
        e.preventDefault()
        const msg = {
            message: { text: e.target.message.value, sender: props.user._id, direction: "right" },
            meta: "textmessage",
            cuid: e.target.cuid.value,
        }
        
        channel.messages.push(msg.message)
        SocketCL.SendMessage(msg)
        e.target.message.value = ""
    }

    return (
        <Container fluid className={classNames("content", { "is-open": props.isOpen })}>
            <Navbar className="navbar shadow-sm p-3 rounded" expand>
                <button className="siderbar-toggle" onClick={props.toggle}>
                    <BsChatLeftText />
                </button>
                <span className="mx-3">|</span>
                <Navbar.Collapse>
                    {props.loadedChannels &&
                        props.loadedChannels.map((channel, i) => {
                            return <ChannelTab channel={channel} selectTab={props.selectTab} key={i} />
                        })}
                </Navbar.Collapse>
            </Navbar>
            {(channel !== null) && <MessagePanel channel={channel} SendMessage={SendMessage}/>}
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
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBarContent)
