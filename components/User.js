import { Component } from "react"
import Auth from "./Auth"

const auth = new Auth()

class User extends Component {
    componentWillMount() {
        this.setState({
            profile: {}
        })
        const { userProfile, getProfile } = auth
        if (!userProfile) {
            getProfile((err, profile) => {
                this.setState({ profile })
            })
        } else {
            this.setState({ profile: userProfile })
        }
    }
    render() {
        return (
            <h3>User Component</h3>
        )
    }
}

export default User