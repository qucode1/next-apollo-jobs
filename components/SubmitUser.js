import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { allUsers } from './UserList';

import PlacesImport from './PlacesImport'

class SubmitUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            googleAPIReady: false,
            firstName: "",
            lastName: "",
            email: "",
            location: {
                name: "",
                lat: "",
                lng: ""
            }
        }
        this.addAutocomplete = this.addAutocomplete.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount() {
        this.addAutocomplete()
    }
    addAutocomplete() {
        if (window.google && window.google.maps) {
            const locationInput = document.querySelector("#locationInput")
            const autocomplete = new google.maps.places.Autocomplete(
                locationInput,
                { types: ["(regions)"], componentRestrictions: { country: "DE" } }
            )

            locationInput.addEventListener("keydown", (e) => {
                if (e.keyCode === 13) {
                    e.preventDefault()
                    this.state.location.name && this.addLocation(e)
                }
            })

            autocomplete.addListener("place_changed", e => this.handleLocationChange(e, autocomplete))

            this.setState({
                googleAPIReady: (window.google && window.google.maps)
            })
            // give google places script time to finish loading and try again
        } else setTimeout(this.addAutocomplete, 50)
    }
    handleInputChange({ target: { name, value } }) {
        this.setState({
            [name]: value
        })
    }
    handleLocationChange(e, autocomplete) {
        const place = autocomplete.getPlace()
        if (place.geometry) {
            this.setState({
                location: {
                    name: place.vicinity,
                    lat: parseFloat(place.geometry.location.lat()),
                    lng: parseFloat(place.geometry.location.lng())
                }
            })
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        const { firstName, lastName, email, location } = this.state
        const form = event.target;
        const input = {
            firstName,
            lastName,
            email
        }
        if (location) {
            const locationObj = {
                coordinates: [location.lng, location.lat],
                address: location.name
            }
            // console.dir(locationObj)
            this.props.createUser(input, locationObj)
        }
    }
    render() {
        const { firstName, lastName, email } = this.state
        return (
            <Fragment>
                {!this.state.googleAPIReady && <PlacesImport />}
                <form onSubmit={this.handleSubmit}>
                    <h1>New User:</h1>
                    <input
                        autoFocus
                        className="input"
                        placeholder="First Name"
                        name="firstName"
                        type="text"
                        required
                        onChange={this.handleInputChange}
                        value={firstName}
                    />
                    <input
                        className="input"
                        placeholder="Last Name"
                        name="lastName"
                        type="text"
                        required
                        onChange={this.handleInputChange}
                        value={lastName}
                    />
                    <input
                        className="input"
                        placeholder="Email"
                        name="email"
                        type="email"
                        required
                        onChange={this.handleInputChange}
                        value={email}
                    />
                    <input
                        id="locationInput"
                        className="input"
                        placeholder="location"
                        name="location"
                        type="text"
                        required
                    />
                    <button className="button" type="submit">
                        Create User
                    </button>
                </form>
                <style jsx>{`
                    form {
                        display: flex;
                        flex-direction: column
                    }
                    input, button {
                        margin: 5px 0
                    }
                `}</style>
            </Fragment>
        );
    }
}

const createUser = gql`
  mutation createUser($input: UserInput!, $location: LocationInput!) {
    createUser(input: $input, location: $location) {
      id
      email
      firstName
      lastName
      location {
          address
      }
    }
  }
`;

export default graphql(createUser, {
    props: ({ mutate }) => ({
        createUser: (input, location) =>
            mutate({
                variables: { input, location },
                update: (proxy, { data: { createUser } }) => {
                    const data = proxy.readQuery({
                        query: allUsers,
                    });
                    proxy.writeQuery({
                        query: allUsers,
                        data: {
                            ...data,
                            allUsers: [createUser, ...data.allUsers],
                        },
                    });
                },
            }),
    }),
})(SubmitUser);