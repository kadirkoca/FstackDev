import React, { useState } from "react"
import { Modal, Button, InputGroup, FormControl, Form } from "react-bootstrap"
import dataService from "../services/data-service"
import Toast from "./Toast"

const AddStackModal = (props) => {
    const [modalImage, setModalImage] = useState("")

    const loadImage = (e) => {
        e.preventDefault()
        const src = e.target.elements.imageUrl.value
        if (!!src) {
            setModalImage(src)
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        if (!modalImage) {
            return Toast("error", "Image has not loaded, please load the image before submit the form")
        }
        const fd = new FormData(e.target)
        fd.set("image", modalImage)
        const data = Object.fromEntries(fd.entries())

        if (fd) {
            dataService
                .AddStack(data)
                .then((response) => {
                    props.onHide()
                    Toast("success", 'New stack has been created !')
                })
                .catch((e) => {
                    Toast("error", e)
                })
        }
    }

    return (
        <Modal size="md" aria-labelledby="contained-modal-title-vcenter" centered show={props.isOpen} onHide={props.onHide}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Adding a new stack</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className="text-center">Image</h4>
                <img src={modalImage} className="ModalImage" />
                <form onSubmit={loadImage}>
                    <InputGroup className="mb-3">
                        <FormControl required placeholder="Type image url" name="imageUrl" />
                        <Button variant="outline-secondary" type="submit">
                            Load Image
                        </Button>
                    </InputGroup>
                </form>
                <form onSubmit={onSubmit} id="form">
                    <Form.Group className="mb-3">
                        <Form.Control required type="text" placeholder="Stack Title" className="mb-3" name="title" />
                        <Form.Label>Stack Summary</Form.Label>
                        <Form.Control required as="textarea" rows={3} className="no-resize" name="summary" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control required type="text" placeholder="Stack Developer" className="mb-3" name="developer" />
                        <Form.Control
                            required
                            type="text"
                            placeholder="Stack Trend Channel"
                            className="mb-3"
                            name="trendchannel"
                        />
                        <Form.Control required type="text" placeholder="Release Channel" className="mb-3" name="releasechannel" />
                        <Form.Control required type="text" placeholder="Web URL" className="mb-3" name="weburl" />
                        <Form.Control required type="text" placeholder="Repository URL" className="mb-3" name="giturl" />
                    </Form.Group>
                </form>
                <p>** Those info requested above will be stored in the database and they will be tracking for the latest news</p>
            </Modal.Body>
            <Modal.Footer>
                <Button form="form" type="submit" variant="outline-success">
                    Save
                </Button>
                <Button onClick={props.onHide} variant="outline-secondary">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AddStackModal
