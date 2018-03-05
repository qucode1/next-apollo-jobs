import App from '../components/App'
import withData from '../lib/withData'

import AddData from '../components/AddData'

export default withData(() => (
  <App>
    <AddData />
  </App>
))
