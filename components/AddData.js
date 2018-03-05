import { Component, Fragment } from 'react';

import UserList from '../components/UserList'
import Submit from '../components/Submit'
import SubmitJob from '../components/SubmitJob'
import JobList from '../components/JobList';

class AddData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeCategory: "user"
        }
    }
    changeActiveCategory = ({ target: { name } }) => {
        this.setState({
            activeCategory: name
        })
    }
    render() {
        const { activeCategory } = this.state
        return (
            <div className="root">
                <div className="controls">
                    <button name="user" onClick={this.changeActiveCategory}>Add User</button>
                    <button name="job" onClick={this.changeActiveCategory}>Add Job</button>
                </div>
                {activeCategory === "user" && (
                    <Fragment>
                        <Submit />
                        <UserList />
                    </Fragment>
                )
                }
                {activeCategory === "job" && (
                    <Fragment>
                        <SubmitJob />
                        <JobList />
                    </Fragment>
                )}
                <style jsx>{`
                    .root {
                        display: flex;
                        flex-direction: column
                    }
                    .controls {
                        display: flex;
                    }
                    button {
                        margin: 5px
                    }
                `}</style>
            </div>
        )
    }
}

export default AddData