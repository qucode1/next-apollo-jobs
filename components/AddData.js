import { Component, Fragment } from 'react';

import UserList from '../components/UserList'
import SubmitUser from '../components/SubmitUser'
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
            <div>
                <div>
                    <button name="user" onClick={this.changeActiveCategory}>Add User</button>
                    <button name="job" onClick={this.changeActiveCategory}>Add Job</button>
                </div>
                {activeCategory === "user" && (
                    <Fragment>
                        <SubmitUser />
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
            </div>
        )
    }
}

export default AddData