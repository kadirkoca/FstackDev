import React, { useState, createRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, Button, Form } from "react-bootstrap"
import ReCAPTCHA from "react-google-recaptcha"
import isEmail from "validator/lib/isEmail"
import { connect } from "react-redux"
import { SignupAction } from "../actions/auth-actions"
import AuthService from "../services/auth-service"

const recaptchaRef = React.createRef()

const Signup = (props) => {
    const [emailError, setEmailError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [passwordConfirmError, setPasswordConfirmError] = useState(null)
    const navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault()
        recaptchaRef.current.execute()
        const name = e.target.elements.name.value
        const email = e.target.elements.email.value
        const password = e.target.elements.password.value
        const confirmpassword = e.target.elements.confirmpassword.value

        if (password.match(/["\.,=\']/)) {
            setPasswordError("Password is invalid please type a valid password")
        }
        if (password !== confirmpassword) {
            setPasswordConfirmError("Confirming the password is easy, just write the same password !")
        }
        if (!isEmail(email)) {
            setEmailError("Email is invalid please type a valid email")
        }

        AuthService.SignupService(name, email, password)
            .then((context) => {
                props.SignupAction(context)
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
                        <span>Registration Form</span>
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.RECAPTCHA_SITE_KEY} />
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Who are you ?" name="name" required />
                            </Form.Group>
                            <Form.Group className="mb-3">
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
                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                {passwordConfirmError ? (
                                    <>
                                        <Form.Control
                                            type="password"
                                            placeholder="Confirm Password"
                                            name="confirmpassword"
                                            minLength="8"
                                            maxLength="20"
                                            required
                                            isInvalid
                                            onClick={() => setPasswordConfirmError(null)}
                                        />
                                        <Form.Control.Feedback type="invalid">{passwordConfirmError}</Form.Control.Feedback>
                                    </>
                                ) : (
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm Password"
                                        name="confirmpassword"
                                        minLength="8"
                                        maxLength="20"
                                        required
                                    />
                                )}
                                <Form.Text className="mt-3" muted>
                                    Your password must be 8-20 characters long, contain letters and numbers, and must not contain
                                    spaces, special characters, or emoji. Invalid characters within parentheses (= ' " . ,)
                                </Form.Text>
                            </Form.Group>
                            <Button type="submit" variant="outline-success" className="w-100">
                                Submit
                            </Button>
                            <label className="text-center d-block muted mt-3">
                                I have an account. So <a href="/login">Sign In?</a>
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
    SignupAction: (auth) => dispatch(SignupAction(auth)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
