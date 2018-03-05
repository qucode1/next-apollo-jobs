
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const User = ({ user }) => (
    <div className="card">
        <style jsx>{`
      .card {
        margin-top: 20px;
      }
    `}</style>
        <header className="card-header">
            <p className="card-header-title">{user.title}</p>
        </header>
        <div className="card-content">
            <div className="content">{user.email}</div>
        </div>
        <footer className="card-footer">
            <div className="card-footer-item">
                Written by: {user.firstName} {user.lastName}
            </div>
        </footer>
    </div>
);

const UserList = ({ data }) => {
    const { error, allUsers } = data;
    if (error) {
        return <div>Error loading users.</div>;
    }
    if (allUsers && allUsers.length) {
        return (
            <section>
                <ul>{allUsers.map(user => <User key={user.id} user={user} />)}</ul>
            </section>
        );
    }
    return <div>Loading</div>;
};

export const allUsers = gql`
  query {
    allUsers {
      id
      firstName
      lastName
      email
    }
  }
`;
// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (UserList)
export default graphql(allUsers)(UserList);
