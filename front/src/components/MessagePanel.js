import React, { useState } from "react"
import { BiExit, BiSend } from "react-icons/bi"
import MessageBubble from "./MessageBubble"
import { connect, batch } from "react-redux"
import SocketCL from "../services/socket-service"
import { EnterChannelAction, ExitChannelAction } from "../actions/channel-actions"
import ColorGenerate from "../utils/word-to-color"

const MessagePanel = (props) => {
    const [stateChannel, setChannel] = useState({})
    const channel = props.currentChannel

    if (!channel || typeof channel !== "object" || Object.keys(channel).length === 0) return <></>
    if (!stateChannel) setChannel(channel)
    const serverMsg = props.server_messages ? props.server_messages.find((msg) => msg.uid === channel.uid) : undefined

    const smessages = channel.messages
    const creatorname = channel.creator.name
    const firstTwoLetters = creatorname.substring(0, 2).toUpperCase()
    const bgColor = ColorGenerate(creatorname)

    const SendMessage = (e) => {
        e.preventDefault()
        const msg = {
            message: { text: e.target.message.value, sender: { id: props.user._id, name: props.user.name } },
            meta: "textmessage",
            uid: e.target.cuid.value,
        }
        //channel.messages.push(msg.message)
        SocketCL.SendMessage(msg)
        e.target.message.value = ""
    }

    const ExitChannel = (e) => {
        let channelWillEnter = {}
        const uid = channel.uid
        if (props.loadedChannels.length > 1) {
            channelWillEnter = props.loadedChannels.find((ch) => channel.uid !== ch.uid)
        } else {
            setChannel({})
        }
        const data = {
            user_id: props.user._id,
            uid
        }
        batch(() => {
            props.ExitChannelAction(data)
            props.EnterChannelAction(channelWillEnter)
        })
        SocketCL.LeaveChannel(uid, props.user)
    }

    return (
        <div>
            {channel && (
                <div className="container-fluid message-panel-container">
                    <div className="message-panel-header">
                        <div className="avatar" style={{ background: bgColor }}>
                            <span>{firstTwoLetters}</span>
                        </div>
                        <div className="infobox">
                            <p>{channel.subject}</p>
                            <label className="muted small">{channel.participants.length} participant</label>
                        </div>
                        <button className="siderbar-toggle" onClick={ExitChannel}>
                            <BiExit />
                            Exit
                        </button>
                    </div>
                    <div className="message-panel">
                        {serverMsg && <span className="server-message">{serverMsg.message}</span>}
                        {smessages &&
                            smessages.map((data, i) => {
                                if (!data.text) return
                                let direction = "left"
                                if (data.sender.id === props.user._id) {
                                    direction = "right"
                                }
                                return (
                                    <MessageBubble key={i} title={data.sender.name} content={data.text} direction={direction} />
                                )
                            })}
                    </div>
                    <div className="message-panel-footer">
                        <form onSubmit={SendMessage} autoComplete="off" className="w-100">
                            <input placeholder="Type a text" name="message" />
                            <input type="hidden" name="cuid" value={channel.uid} />
                            <button type="submit">
                                <BiSend /> Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = (state) => {
    const { server_messages, currentChannel, loadedChannels } = state.channel || {}
    const { user } = state.auth || {}
    return {
        server_messages,
        currentChannel,
        loadedChannels,
        user,
    }
}
const mapDispatchToProps = (dispatch) => ({
    EnterChannelAction: (context) => dispatch(EnterChannelAction(context)),
    ExitChannelAction: (context) => dispatch(ExitChannelAction(context)),
})
export default connect(mapStateToProps, mapDispatchToProps)(MessagePanel)
