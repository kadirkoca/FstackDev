import React, { useState, createRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Button, Form } from "react-bootstrap"
import ReCAPTCHA from "react-google-recaptcha"
import isEmail from "validator/lib/isEmail"
import { connect } from "react-redux"
import { LoginAction } from "../actions/auth-actions"
import AuthService from "../services/auth-service"

const recaptchaRef = createRef()

const Login = (props) => {
    const [emailError, setEmailError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault()
        recaptchaRef.current.execute()
        const email = e.target.elements.email.value
        const password = e.target.elements.password.value

        if (password.match(/["\.,=\']/)) {
            setPasswordError("Password is invalid please type a valid password")
        }
        if (!isEmail(email)) {
            setEmailError("Email is invalid please type a valid email")
        }

        AuthService.LoginService(email, password)
            .then((context) => {
                props.LoginAction(context)
                navigate(-1)
            })
            .catch((e) => {
                const error = e.error
                if (error.includes("password")) {
                    setPasswordError(error)
                }
                if (error.includes("email")) {
                    setEmailError(error)
                }
            })
    }

    return (
        <div className="container mt-5">
            <div className="row d-flex justify-content-center">
                <Card className="col-md-4 p-0">
                    <Card.Header>
                        <span>Login Form</span>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.RECAPTCHA_SITE_KEY} />
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                {emailError ? (
                                    <>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter email"
                                            name="email"
                                            required
                                            isInvalid
                                            onClick={() => setEmailError(null)}
                                        />
                                        <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
                                    </>
                                ) : (
                                    <Form.Control type="email" placeholder="Enter email" name="email" required />
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                {passwordError ? (
                                    <>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                            minLength="8"
                                            maxLength="20"
                                            required
                                            isInvalid
                                            onClick={() => setPasswordError(null)}
                                        />
                                        <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
                                    </>
                                ) : (
                                    <Form.Control
                                        type="password"
                                        placeholder="Password"
                                        name="password"
                                        minLength="8"
                                        maxLength="20"
                                        required
                                    />
                                )}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Remember Me" className="d-inline-block" />
                                <label className="float-end muted">
                                    Forgot <a href="#">password?</a>
                                </label>
                            </Form.Group>
                            <Button type="submit" variant="outline-success" className="w-100">
                                Login
                            </Button>
                            <label className="text-center d-block muted mt-3">
                                I don't have an account. So <a href="/signup">Sign Up?</a>
                            </label>
                        </Form>
                    </Card.Body>
                    <Card.Footer>
                        <Form.Text muted>
                            **We use google reCaptcha to prevent bot/spam attacks. Google reCaptcha may collect personal info for
                            security reasons. For more info please take a look at
                            <a
                                href="https://en.wikipedia.org/wiki/Online_Privacy_Protection_Act"
                                target="_blank"
                                className="ms-2"
                            >
                                CalOPPA
                            </a>{" "}
                            and
                            <a href="https://gdpr.eu/" target="_blank" className="ms-2">
                                GDPR
                            </a>
                        </Form.Text>
                    </Card.Footer>
                </Card>
            </div>
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

const mapDispatchToProps = (dispatch) => ({
    LoginAction: (auth) => dispatch(LoginAction(auth)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Login)
