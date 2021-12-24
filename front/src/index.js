import React, { useState, useEffect } from "react"
import ReactDOM from "react-dom"
import "normalize.css/normalize.css"
import "bootstrap/dist/css/bootstrap.css"
import "./assets/style.scss"
import AppRouter from "./routers/AppRouter"
import { Provider } from "react-redux"
import ConfigureStore from "./store/data-store"
import { ToastContainer } from "./components/Toast"

const socketURL = process.env.WEB_SOCKET_URL

const App = (
    <Provider store={ConfigureStore}>
        <AppRouter />
        <ToastContainer />
    </Provider>
)

ReactDOM.render(App, document.getElementById("app"))
