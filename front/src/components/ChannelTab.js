import React from "react"
import { Button, Nav } from "react-bootstrap"
import ChannelBox from "./ChannelBox"
import { BsChevronBarExpand, BsStarHalf, BsStar } from "react-icons/Bs"
import { connect } from "react-redux"

const ChannelTab = (props) => {
    const classname = props.channeltab.uid === props.currentchannelID ? 'active channel-tab' : 'channel-tab'
    
    return (
        <div className={classname} index={props.channeltab.uid} onClick={props.click}>
            <button>{props.channeltab.subject}</button>
        </div>
    )
}


const mapStateToProps = (state) => {
    const { currentchannelID } = state.channel || {}
    return {
        currentchannelID
    }
}
export default connect(mapStateToProps)(ChannelTab)