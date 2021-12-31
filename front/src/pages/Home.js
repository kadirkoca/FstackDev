import React, { useState, useEffect } from "react"
import Header from "../components/Header"
import { connect } from "react-redux"
import dataService from "../services/data-service"
import Toast from "../components/Toast"
import Spinner from "../components/Spinner"
import { StacksAction } from "../actions/data-actions"

const Home = (props) => {
    const [stacks, setStacks] = useState(props.stacks ? props.stacks : null)

    useEffect(() => {
        if (stacks === null) {
            dataService
                .GetHOME()
                .then((data) => {
                    const rawdata = data.stacks.map((stack) => {
                        stack.ratings = {
                            ups: 143,
                            downs: 120,
                        }
                        return stack
                    })
                    props.StacksAction({ stacks: rawdata })
                    setStacks(rawdata)
                })
                .catch((e) => {
                    Toast("error", e.toString())
                })
        }
    }, [])

    const level = props.user ? props.user.level : null
    return <>{stacks === null ? <Spinner /> : <Header stacks={stacks} level={level} />}</>
}

const mapStateToProps = (state) => {
    const { authenticated, token, user } = state.auth || {}
    const { stacks } = state.data || {}

    return {
        authenticated,
        token,
        user,
        stacks,
    }
}

const mapDispatchToProps = (dispatch) => ({
    StacksAction: (stacks) => dispatch(StacksAction(stacks)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
