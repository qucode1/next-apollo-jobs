import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { allJobs } from './JobList';

import PlacesImport from './PlacesImport'

class SubmitJob extends Component {
    constructor(props) {
        super(props)
        this.state = {
            googleAPIReady: false,
            title: "",
            description: "",
            location: {
                name: "",
                lat: "",
                lng: ""
            },
            locations: []
        }
        this.addAutocomplete = this.addAutocomplete.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleLocationChange = this.handleLocationChange.bind(this)
        this.addLocation = this.addLocation.bind(this)
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
    addLocation(e) {
        e.preventDefault()
        if (this.state.location.name) {
            this.setState(state => (
                {
                    locations: [...state.locations, state.location],
                    location: {
                        name: "",
                        lat: "",
                        lng: ""
                    }
                }
            ), () => document.querySelector("#locationInput").value = "")
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        const { title, description, locations } = this.state
        const form = event.target;
        const input = {
            title,
            description
        }
        if (locations.length > 0) {
            const locationsObj = locations.map(location => ({
                coordinates: [location.lng, location.lat],
                address: location.name
            }))
            console.dir(locationsObj)
            this.props.createJob(input, locationsObj)
        }
        // form.reset();
    }
    render() {

        return (
            <Fragment>
                {!this.state.googleAPIReady && <PlacesImport />}
                <form onSubmit={this.handleSubmit}>
                    <h1>New Job:</h1>
                    <input
                        autoFocus
                        className="input"
                        placeholder="title"
                        name="title"
                        type="text"
                        required
                        onChange={this.handleInputChange}
                        value={this.state.jobtitle}
                    />
                    <input
                        className="input"
                        placeholder="description"
                        name="description"
                        type="text"
                        required
                        onChange={this.handleInputChange}
                        value={this.state.jobdescription}
                    />
                    <ul>
                        {this.state.locations.map(location => (
                            <li key={location.name}>
                                <h4>{location.name}</h4>
                                <p>{`lat: ${location.lat} - lng: ${location.lng}`}</p>
                            </li>
                        ))}
                    </ul>
                    <input id="locationInput" className="input" placeholder="location" name="location" type="text" />
                    <button onClick={this.addLocation}>Add Location</button>
                    <button className="button" type="submit">
                        Create
                </button>
                </form>
                <input type="text" placeholder="city" disabled value={this.state.location.name} />
                <input type="number" placeholder="lng" disabled value={this.state.location.lng} />
                <input type="number" placeholder="lat" disabled value={this.state.location.lat} />
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
};

const createJob = gql`
    mutation createJob($input: JobInput!, $locations: [LocationInput!]!) {
        createJob(input: $input, locations: $locations) {
            id
            title
            description
            locations {
                address
            }
        }
    }
`;

export default graphql(createJob, {
    props: ({ mutate }) => ({
        createJob: (input, locations) =>
            mutate({
                variables: { input, locations },
                update: (proxy, { data: { createJob } }) => {
                    const data = proxy.readQuery({
                        query: allJobs,
                    });
                    proxy.writeQuery({
                        query: allJobs,
                        data: {
                            ...data,
                            allJobs: [createJob, ...data.allJobs],
                        },
                    });
                },
            }),
    }),
})(SubmitJob);