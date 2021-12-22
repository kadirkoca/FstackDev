import React, { useState } from "react"
import { Container, Row, Col, Button } from "react-bootstrap"
import StackBox from "./StackBox"
import AddStackModal from "./AddStackModal"

const Header = (props) => {
    // MODAL
    const [addStack, setAddStack] = useState(false)
    const handleAddStack = () => setAddStack(true)
    const handleCloseStackModal = () => setAddStack(false)

    const isSuper = props.level === "super"
    
    return (
        <Container fluid className="header-section">
            {isSuper ? (
                <Button onClick={handleAddStack} variant="outline-secondary">
                    Add Stack
                </Button>
            ) : (
                ""
            )}
            <Row>
                {!!props.stacks && props.stacks.map((card, i) => (
                    <Col key={i} md="3" xs={6}>
                        <StackBox key={i} data={card} />
                    </Col>
                ))}
            </Row>
            <AddStackModal isOpen={addStack} onHide={handleCloseStackModal} />
        </Container>
    )
}

export default Header
