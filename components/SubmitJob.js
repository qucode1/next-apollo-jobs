import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { allJobs } from './JobList';
import Head from 'next/head'

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
            }
        }
        this.addAutocomplete = this.addAutocomplete.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleLocationChange = this.handleLocationChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount() {
        this.addAutocomplete()
    }
    addAutocomplete() {
        if (window.google && window.google.maps) {
            const locationInput = document.querySelector("#locationInput")
            locationInput.addEventListener("keydown", (e) => {
                if (e.keyCode === 13) e.preventDefault()
            })

            const autocomplete = new google.maps.places.Autocomplete(locationInput, { types: ["(regions)"], componentRestrictions: { country: "DE" } })
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
        this.setState({
            location: {
                name: place.vicinity,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            }
        })
    }
    handleSubmit(event) {
        event.preventDefault();
        const { title, description, location: { name, lat, lng } } = this.state
        const form = event.target;
        const input = {
            title,
            description
        }
        const locations = [{
            coordinates: [parseFloat(lng), parseFloat(lat)],
            address: name
        }]
        this.props.createJob(input, locations);
        // form.reset();
    }
    render() {

        return (
            <Fragment>
                {!this.state.googleAPIReady && <Head>
                    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBZHOD7ycm16JS2OQ-gHcAihzXvwe6Gaf8&libraries=places&language=de&region=DE"></script>
                </Head>}
                <form onSubmit={this.handleSubmit}>
                    <h1>New Job:</h1>
                    <input className="input" placeholder="title" name="title" type="text" required onChange={this.handleInputChange} value={this.state.jobtitle} />
                    <input className="input" placeholder="description" name="description" type="text" required onChange={this.handleInputChange} value={this.state.jobdescription} />
                    <input id="locationInput" className="input" placeholder="location" name="location" type="text" required />
                    <button className="button" type="submit">
                        Create
                </button>
                </form>
                <input type="text" placeholder="city" disabled value={this.state.location.name} />
                <input type="text" placeholder="lng" disabled value={this.state.location.lng} />
                <input type="text" placeholder="lat" disabled value={this.state.location.lat} />
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
        createJob(input: $input, locations:$locations) {
            id
            title
            description
            locations {
                type
                coordinates
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