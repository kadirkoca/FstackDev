import React, { createRef } from "react"
import { useNavigate } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha"
import { connect } from "react-redux"
import { LogoutAction } from "../actions/auth-actions"
import AuthService from "../services/auth-service"

const recaptchaRef = createRef()

const Logout = (props) => {
    const navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault()
        recaptchaRef.current.execute()

        AuthService.LogoutService()
            .then((context) => {
                props.LogoutAction(context)
                navigate('/', { replace: true })
            })
            .catch((e) => {
                //console.log(e)
            })
    }

    return (
        <form onSubmit={onSubmit}>
            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.RECAPTCHA_SITE_KEY} />
            <button type="submit" className="no-style-button nav-link">
                Out
            </button>
        </form>
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

const mapDispatchToProps = (dispatch) => ({
    LogoutAction: (context) => dispatch(LogoutAction(context)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Logout)
