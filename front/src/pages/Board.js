import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import dataService from "../services/data-service"
import Toast from "../components/Toast"
import Spinner from "../components/Spinner"

const Board = (props) => {
    const [stacks, setStacks] = useState(null)

    // useEffect(() => {
    //     dataService
    //         .GetHOME()
    //         .then((data) => {
    //             const rawdata = data.stacks.map((stack) => {
    //                 stack.ratings = {
    //                     ups: 143,
    //                     downs: 120,
    //                 }
    //                 return stack
    //             })
    //             setStacks(rawdata)
    //         })
    //         .catch((e) => {
    //             Toast("error", e.error.message)
    //         })
    // }, [])

    const level = props.user ? props.user.level : null
    return (
        <div className="container board">

        </div>
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

export default connect(mapStateToProps)(Board)
