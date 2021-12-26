import React from "react"
import { connect } from "react-redux"
import {
    EnterChannelAction,
} from "../actions/channel-actions"

const ChannelTab = (props) => {
    const classname = props.channel.uid === props.currentChannel.uid ? 'active channel-tab' : 'channel-tab'
    
    const selectTab = (e) => {
        const currentchannelID = e.target.attributes.index.value
        const channel = props.channels.find((channel) => channel.uid === currentchannelID)
        props.dispatch(EnterChannelAction(channel))
    }

    return (
        <div className={classname} index={props.channel.uid} onClick={selectTab}>
            <button>{props.channel.subject}</button>
        </div>
    )
}


const mapStateToProps = (state) => {
    const { currentChannel, channels } = state.channel || {}
    return {
        currentChannel,
        channels
    }
}
export default connect(mapStateToProps)(ChannelTab)