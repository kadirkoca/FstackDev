import React from "react"
import ColorGenerate from '../utils/word-to-color'

const ChannelBox = (props) => {
    if(props.channel === null || !props.channel.hasOwnProperty('uid')) return <></>
    const participants = props.channel.participants.length
    
    const firstTwoLetters = props.channel.creator.name.substring(0, 2).toUpperCase()
    const bgColor = ColorGenerate(props.channel.creator.name)

    return (
        <div className="channel-box" onClick={props.ChannelSelected} channelid={props.channel.uid}>
            <div className="avatar" style={{ background: bgColor}}>
                <span>{firstTwoLetters}</span>
            </div>
            <div className="infobox">
                <p>{props.channel.subject}</p>
                <label className="muted small">{participants} participant</label>
                <div className="infoline">
                    <span>{props.channel.creator.name}</span>
                    <label className="muted small">12 Dec, 14:02</label>
                </div>
            </div>
        </div>
    )
}

export default ChannelBox
