import React from "react"
import { connect } from "react-redux"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import Navbar from "../components/NavigationBar"
import Home from "../pages/Home"
import Live from "../pages/Live"
import Board from "../pages/Board"
import Login from "../pages/Login"
import Signup from "../pages/Signup"

const AppRouter = (props) => {
    const { authenticated } = props
    return (
        <React.StrictMode>
            <Router>
                <Navbar />
                <Routes>
                    <Route exact path="/live" element={authenticated ? <Live /> : <Navigate replace to="/" />} />
                    <Route exact path="/board" element={authenticated ? <Board /> : <Navigate replace to="/" />} />
                    <Route exact path="/login" element={!authenticated ? <Login /> : <Navigate replace to="/" />} />
                    <Route exact path="/signup" element={!authenticated ? <Signup /> : <Navigate replace to="/" />} />
                    <Route exact path="/" element={<Home />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                </Routes>
            </Router>
        </React.StrictMode>
    )
}

const mapStateToProps = (state) => {
    const { authenticated, token, user } = state.auth || {}

    return {
        authenticated,
        token,
        user,
    }
}

export default connect(mapStateToProps)(AppRouter)
