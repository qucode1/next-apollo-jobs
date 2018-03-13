import { Component } from "react"
import Router from "next/router"

import App from "../components/App"

import Auth from "../components/Auth"

const auth = new Auth()

export default class CallBack extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        if (/access_token|id_token|error/.test(Router.asPath)) {
            auth.handleAuthentication()
        }
    }
    render() {
        return (
            <App>
                <div>Auth Callback - Loading...</div>
            </App>
        )
    }
}