import React, { useState, useEffect, useRef } from "react"
import { Container, Row, Col, Navbar, Button, Nav } from "react-bootstrap"
import moment from "moment"

const MessageBubble = (props) => {
    const classname = "message-bubble " + props.direction
    const time = moment().format("hh:mm")
    const messagePanelEnd = useRef()
    
    const scrollToBottom = () => {
        messagePanelEnd.current?.scrollIntoView({behavior: "smooth", block: "end", inline: "center"})
    }

    useEffect(() => {
        scrollToBottom()
    }, [])


    return (
        <div className="message-bubble-container" ref={messagePanelEnd}>
            <div className={classname}>
                <div className="header">
                    <span className="title">{props.title}</span>
                    <label className="muted small">{time}</label>
                </div>
                <span className="content">{props.content}</span>
            </div>
        </div>
    )
}

export default MessageBubble
