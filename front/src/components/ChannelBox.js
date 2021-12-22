import React, { useState, useEffect } from "react"
import { Container, Row, Col, Navbar, Button, Nav } from "react-bootstrap"
import classNames from "classnames"

const ChannelBox = (props) => {
    const participants = props.channelbox.participants.length
    return (
        <div className="channel-box" onClick={props.ChannelSelected} channelid={props.channelbox.uid}>
            <div className="avatar">
                <span>KA</span>
            </div>
            <div className="infobox">
                <p>{props.channelbox.subject}</p>
                <label className="muted small">{participants} participant</label>
                <div className="infoline">
                    <span>{props.channelbox.creator}</span>
                    <label className="muted small">12 Dec, 14:02</label>
                </div>
            </div>
        </div>
    )
}

export default ChannelBox
