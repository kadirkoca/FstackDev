import React from "react"
import { Container, Navbar, Nav } from "react-bootstrap"
import classNames from "classnames"
import { BsChatLeftText } from "react-icons/bs"
import ChannelTab from "./ChannelTab"
import MessagePanel from "./MessagePanel"
import { connect } from "react-redux"

const SideBarContent = (props) => {
    return (
        <Container fluid className={classNames("content", { "is-open": props.isOpen })}>
            <Navbar className="navbar shadow-sm rounded" expand>
                <button className="siderbar-toggle" onClick={props.toggle}>
                    <BsChatLeftText />
                </button>
                <span className="mx-3">|</span>
                <Navbar.Collapse>
                    {props.loadedChannels &&
                        props.loadedChannels.map((channel, i) => {
                            return <ChannelTab channel={channel} key={i} />
                        })}
                </Navbar.Collapse>
            </Navbar>
            <MessagePanel/>
        </Container>
    )
}

const mapStateToProps = (state) => {
    const { loadedChannels } = state.channel || {}
    return {
        loadedChannels,
    }
}
export default connect(mapStateToProps)(SideBarContent)