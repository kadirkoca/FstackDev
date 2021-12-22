import React from "react"
import { Link, NavLink } from "react-router-dom"
import { Nav, Navbar, Container, Row, Col } from "react-bootstrap"
import { connect } from "react-redux"
import Logout from "./Logout"

class NavigationBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            screenMobile: window.innerWidth < 400,
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.reSizeWindow)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.reSizeWindow)
    }

    reSizeWindow = (e) => {
        this.setState({ screenMobile: window.innerWidth < 600 })
    }

    render() {
        return (
            <Navbar>
                <Container fluid>
                    <Navbar.Brand>
                        {this.state.screenMobile ? (
                            <Link to="/" className="nav-link">
                                <strong>F</strong>SD
                            </Link>
                        ) : (
                            <Link to="/" className="nav-link">
                                F*** Stack Development
                            </Link>
                        )}
                    </Navbar.Brand>

                    <Nav className="justify-content-end">
                        {!this.props.authenticated ? (
                            <Nav>
                                <div className="navlink-holder">
                                    <Link to="/login" className="nav-link">
                                        In
                                    </Link>
                                </div>
                            </Nav>
                        ) : (
                            <Nav>
                                <div className="navlink-holder">
                                    <Logout className="nav-link"/>
                                </div>
                            </Nav>
                        )}

                        <Nav>
                            <div className="navlink-holder">
                                <NavLink to="/live" className={(navData) => navData.isActive ? "nav-link active" : "nav-link"}>
                                    Live
                                </NavLink>
                            </div>
                        </Nav>
                        <Nav>
                            <div className="navlink-holder">
                                <NavLink to="/board" className={(navData) => navData.isActive ? "nav-link active" : "nav-link"}>
                                    Board
                                </NavLink>
                            </div>
                        </Nav>
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) => {
    const { authenticated, token, user } = state.auth || {}

    return {
        authenticated,
        token,
        user,
    }
}

export default connect(mapStateToProps)(NavigationBar)
