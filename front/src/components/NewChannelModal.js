import React from "react"
import { Modal, Button, Form } from "react-bootstrap"
import dataService from "../services/data-service"
import { connect } from "react-redux"
import SocketCL from "../services/socket-service"
import Toast from "./Toast"

const NewChannelModal = (props) => {
    const onSubmit = (e) => {
        e.preventDefault()

        const subject = e.target.subject.value

        if (subject) {
            SocketCL.CreateChannel(subject, props.user)
        } else {
            Toast("error", "Channel Subject cannot be empty")
        }
        props.onHide()
    }

    return (
        <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={props.isOpen} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Create a new channel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={onSubmit} id="form" autoComplete="off">
                    <Form.Group className="mb-3">
                        <Form.Label>What is this channel's subject ?</Form.Label>
                        <Form.Control required type="text" placeholder="Please type a subject" className="mb-3" name="subject" />
                    </Form.Group>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button form="form" type="submit" variant="outline-success">
                    Create
                </Button>
                <Button onClick={props.onHide} variant="outline-secondary">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

const mapStateToProps = (state) => {
    const { authenticated, token, user } = state.auth || {}
    return {
        token,
        user
    }
}

export default connect(mapStateToProps)(NewChannelModal)
