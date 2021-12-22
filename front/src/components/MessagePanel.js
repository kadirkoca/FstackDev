import React from "react"
import { BiExit, BiSend } from "react-icons/Bi"
import MessageBubble from "./MessageBubble"

const MessagePanel = (props) => {
    const channel = {}
    const messages = channel.messages

    return (
        <>
            {messages && (
                <div className="container-fluid message-panel-container">
                    <div className="message-panel-header">
                        <div className="avatar">
                            <span>{channel.creator.substring(0, 2)}</span>
                        </div>
                        <div className="infobox">
                            <p>{channel.subject}</p>
                            <label className="muted small">{channel.participants} participant</label>
                        </div>

                        <button className="siderbar-toggle" onClick={props.toggle}>
                            <BiExit />
                            Exit
                        </button>
                    </div>
                    <div className="message-panel">
                        {messages.map((data, i) => {
                            if(!data.message)return
                            return <MessageBubble key={i} title={data.user} content={data.message} direction={data.direction} />
                        })}
                    </div>
                    <div className="message-panel-footer">
                        {/* <form onSubmit={SendMessage} autoComplete="off" className="w-100">
                            <input placeholder="Type a text" name="message" />
                            <button type="submit">
                                <BiSend /> Send
                            </button>
                        </form> */}
                    </div>
                </div>
            )}
        </>
    )
}

export default MessagePanel
