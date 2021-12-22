import React from "react"
import { ToastContainer as Container, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Toast = (type, message) => {
    const options = {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    }

    switch (type) {
        case "info":
            return toast.info(message, options)
        case "success":
            return toast.success(message, options)
        case "warning":
            return toast.warn(message, options)
        case "error":
            return toast.error(message, options)
        default:
            return toast(message, options)
    }
}

export const ToastContainer = () => {
    return (
        <Container
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    )
}

export default Toast
