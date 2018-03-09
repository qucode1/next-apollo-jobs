import withData from '../lib/withData'
import App from "../components/App"
import Search from "../components/Search"

export default withData(() => (
    <App>
        <Search />
    </App>
))