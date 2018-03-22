import { Component } from "react"
import withData from '../lib/withData'
import App from "../components/App"
import SearchComponent from "../components/Search"
import Auth from "../components/Auth"

const auth = new Auth()

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inBrowser: false
        }
    }
    componentDidMount() {
        this.setState({
            inBrowser: true
        })
    }
    render() {
        return (
            <App>
                {
                    this.state.inBrowser
                        ? auth.isAuthenticated()
                            ? <SearchComponent />
                            : <h3>You are not authenticated!</h3>
                        : <h3>Loading...</h3>
                }
            </App>
        )
    }
}

export default withData(Search)