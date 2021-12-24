import React from "react"
import { BiExit, BiSend } from "react-icons/Bi"
import MessageBubble from "./MessageBubble"
import { connect } from "react-redux"

const MessagePanel = (props) => {
    const channel = props.channel
    const messages = channel.messages
    
    return (
        <div>
            {messages && (
                <div className="container-fluid message-panel-container">
                    <div className="message-panel-header">
                        <div className="avatar">
                            <span>{channel.creator.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div className="infobox">
                            <p>{channel.subject}</p>
                            <label className="muted small">{channel.participants.length} participant</label>
                        </div>

                        <button className="siderbar-toggle" onClick={props.toggle}>
                            <BiExit />
                            Exit
                        </button>
                    </div>
                    <div className="message-panel">
                        {props.server_message && <span className="server-message">{props.server_message}</span>}                        
                        {messages.map((data, i) => {
                            if(!data.message)return
                            return <MessageBubble key={i} title={data.user.name} content={data.message} direction={data.direction ? data.direction : 'left' } />
                        })}
                    </div>
                    <div className="message-panel-footer">
                        <form onSubmit={props.SendMessage} autoComplete="off" className="w-100">
                            <input placeholder="Type a text" name="message" />
                            <input type="hidden" name="cuid" value={channel.uid}/>
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
    const { server_message } = state.channel || {}

    return {
        server_message
    }
}
export default connect(mapStateToProps)(MessagePanel)