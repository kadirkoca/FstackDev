import React, { useState } from "react"
import { Button } from "react-bootstrap"
import classNames from "classnames"
import ChannelBox from "./ChannelBox"
import { BsChevronBarExpand } from "react-icons/Bs"
import NewChannelModal from "./NewChannelModal"
import { connect } from "react-redux"
import {
    EnterChannelAction,
} from "../actions/channel-actions"

const SideBar = (props) => {
    // MODAL
    const [newChannel, setNewChannel] = useState(false)
    const handleNewChannel = () => setNewChannel(true)
    const handleCloseChannelModal = () => setNewChannel(false)

    const ChannelSelected = (e) => {
        if (e.detail === 2) {
            const currentchannelID = e.target.attributes.channelid.value
            const isLoaded = props.loadedChannels.find((channel) => channel.uid === currentchannelID)
            if(!isLoaded){
                const channel = props.channels.find((channel) => channel.uid === currentchannelID)
                props.JoinChannel(channel)
            }else{
                props.EnterChannelAction(isLoaded)
            }
        }
    }

    return (
        <div className={classNames("sidebar", { "is-open": props.isOpen })}>
            <div className="sidebar-header">
                <Button className="rounded-pill" onClick={handleNewChannel}>
                    + Create a new channel
                </Button>
                <button className="siderbar-toggle" onClick={props.toggle}>
                    <BsChevronBarExpand />
                </button>
            </div>
            <div className="sidebar-channels">
                {props.channels && props.channels.map((channel, i) => {
                    return <ChannelBox key={i} channel={channel} ChannelSelected={ChannelSelected} />
                })}
            </div>
            <NewChannelModal isOpen={newChannel} onHide={handleCloseChannelModal} />
        </div>
    )
}

const mapStateToProps = (state) => {
    const { loadedChannels, channels } = state.channel || {}
    return {
        loadedChannels,
        channels
    }
}
const mapDispatchToProps = (dispatch) => ({
    EnterChannelAction: (context) => dispatch(EnterChannelAction(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
