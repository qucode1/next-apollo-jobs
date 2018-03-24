import { graphql } from "react-apollo"
import gql from "graphql-tag"

const ME_QUERY = gql`
    query {
        me {
            firstName
            lastName
            email
            oAuth
            profileToken
        }
    }
`

const User = ({ me: { me, loading, error } }) => {
    !loading && !error && localStorage.setItem("profile_token", me.profileToken)
    return loading
        ? <div>Loading...</div>
        : !error && me
            ? (<div>
                <h3>{me.firstName} {me.lastName}</h3>
                <p>{me.email}</p>
                <p>{me.oAuth}</p>
                <p>{me.profileToken}</p>
            </div>
            ) : <div>{error.message}</div>


}

export default graphql(ME_QUERY, { name: 'me' })(User)