import { Component, Fragment } from "react"
import { graphql, compose, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import Downshift from "downshift"

import { User, allUsers } from './UserList'
import { Job, allJobs } from './JobList'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            target: "user",
            inputValue: "",
            selectedItem: "",
            queryResult: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.runUserQuery = this.runUserQuery.bind(this)
        this.runJobQuery = this.runJobQuery.bind(this)
    }
    handleChange({ target: { name, value, type } }) {
        // console.log(value);
        (type === "select-one" || type === "text") && (
            this.setState({
                [name]: value
            })
        )
    }
    runUserQuery = async () => {
        console.log("runUserQuery")
        const { data: { allUsers: result, error } } = await this.props.client.query({
            query: allUsers,
            variables: {}
        })
        this.setState({
            queryResult: error || result
        })
    }
    runJobQuery = async () => {
        console.log("runJobQuery")
        const { data: { allJobs: result, error } } = await this.props.client.query({
            query: allJobs,
            variables: {}
        })
        this.setState({
            queryResult: error || result
        })
    }
    handleFocus = () => {
        this.state.target === "user" && this.runUserQuery()
        this.state.target === "job" && this.runJobQuery()
    }
    jobFilter = (i, inputValue) => {
        console.log(i, inputValue)
        return (
            i.title
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "")
                .includes(
                    inputValue.toLowerCase()
                        .replace(/[^a-z0-9]/g, "")
                )
        )
    }
    userFilter = (i, inputValue) => (
        `${i.firstName.toLowerCase()} ${i.lastName.toLowerCase()}`
            .replace(/[^a-z0-9]/g, "")
            .includes(
                inputValue.toLowerCase()
                    .replace(/[^a-z0-9]/g, "")
            )
    )
    render() {
        const {
            allJobs: { allJobs = [], loading: jobsLoading, error: jobsError },
            allUsers: { allUsers = [], loading: usersLoading, error: usersError }
        } = this.props
        const { target } = this.state

        return (
            <Fragment>
                <select name="target" value={target} onChange={this.handleChange}>
                    <option value="user">User</option>
                    <option value="job">Job</option>
                </select>
                <Downshift
                    onSelect={(selectedItem, { inputValue }) => {
                        console.log(selectedItem)
                    }}
                    itemToString={i => (
                        target === "job" && (i ? `${i.title}` : ''),
                        target === "user" && (i ? `${i.firstName} ${i.lastName}` : '')
                    )}
                    queryResult={this.props.queryResult}
                >
                    {({
                        getInputProps,
                        getItemProps,
                        isOpen,
                        inputValue,
                        selectedItem,
                        highlightedIndex,
                        itemToString
                    }) => (
                            <div>
                                <input
                                    {...getInputProps({
                                        placeholder: `${
                                            target === "user"
                                                ? 'User Name'
                                                : target === "job"
                                                    ? "Job Title"
                                                    : "Search..."
                                            }`
                                    })}
                                    onFocus={this.handleFocus}
                                />
                                {this.state.queryResult && !(this.state.queryResult instanceof Error) && isOpen ? (
                                    <div style={{ border: '1px solid #ccc' }}>
                                        {this.state.queryResult
                                            .filter(i => {
                                                if (inputValue) {
                                                    if (target === "user") return this.userFilter(i, inputValue)
                                                    if (target === "job") return this.jobFilter(i, inputValue)
                                                } else return false
                                            }
                                            )
                                            .slice(0, 6)
                                            .map((item, index) => (
                                                <div
                                                    {...getItemProps({ item })}
                                                    key={item.id}
                                                    style={{
                                                        backgroundColor: highlightedIndex === index ? 'gray' : 'white',
                                                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                    }}
                                                >
                                                    {
                                                        target === "user"
                                                            ? `${item.firstName} ${item.lastName}`
                                                            : target === "job"
                                                                ? item.title
                                                                : ""
                                                    }
                                                </div>
                                            ))}
                                    </div>
                                ) : null}
                            </div>
                        )}
                </Downshift>
                {
                    this.state.target === "user" && (
                        usersError
                            ? <div>{usersError.message}</div>
                            : <ul>
                                {!usersLoading && allUsers.map(user => (
                                    <li key={user.id}>{user.firstName}</li>
                                ))}
                            </ul>
                    )
                }
                {
                    this.state.target === "job" &&
                    <ul>
                        {!jobsLoading && allJobs.map(job => (
                            <li key={job.id}>{job.title}</li>
                        ))}
                    </ul>
                }
            </Fragment>
        )
    }
}

export default compose(
    graphql(allUsers, { name: "allUsers" }),
    graphql(allJobs, { name: "allJobs" })
)(withApollo(Search))
