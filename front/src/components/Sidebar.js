import React, { useState } from "react"
import { Button } from "react-bootstrap"
import classNames from "classnames"
import ChannelBox from "./ChannelBox"
import { BsChevronBarExpand } from "react-icons/Bs"
import { EnterChannelAction, LoadChannelAction } from "../actions/channel-actions"
import { connect } from "react-redux"
import NewChannelModal from "./NewChannelModal"

const SideBar = (props) => {
    // MODAL
    const [newChannel, setNewChannel] = useState(false)
    const handleNewChannel = () => setNewChannel(true)
    const handleCloseChannelModal = () => setNewChannel(false)

    const ChannelSelected = (e) => {
        if (e.detail === 2) {
            const currentchannelID = e.target.attributes.channelid.value
            const channel = props.channels.find((channel) => channel.uid === currentchannelID)
            const isLoaded = props.loadedChannels.find((channel) => channel.uid === currentchannelID)    
            props.EnterChannelAction(currentchannelID)            
            if(!isLoaded){
                props.LoadChannelAction(channel)
            } 
            props.JoinChannel(channel)
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
                {props.channels.map((channelbox, i) => {
                    return <ChannelBox key={i} channelbox={channelbox} ChannelSelected={ChannelSelected} />
                })}
            </div>
            <NewChannelModal isOpen={newChannel} onHide={handleCloseChannelModal}/>
        </div>
    )
}

const mapStateToProps = (state) => {
    const { currentchannelID, loadedChannels, channels} = state.channel || {}
    const { authenticated, token, user } = state.auth || {}
    return {
        currentchannelID,
        loadedChannels,
        channels,
        token,
        user
    }
}

const mapDispatchToProps = (dispatch) => ({
    EnterChannelAction: (context) => dispatch(EnterChannelAction(context)),
    LoadChannelAction: (context) => dispatch(LoadChannelAction(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SideBar)
