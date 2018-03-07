import React, { Fragment } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import { allUsers } from './UserList';

import PlacesImport from './PlacesImport'

const Submit = ({ createUser }) => {
    function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new window.FormData(form);
        createUser(formData.get('firstName'), formData.get('lastName'), formData.get('email'));
        form.reset();
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit}>
                <h1>New user:</h1>
                <input className="input" placeholder="firstName" name="firstName" type="text" required />
                <input className="input" placeholder="lastName" name="lastName" type="text" required />
                <input className="input" placeholder="email" name="email" type="email" required />
                <button className="button" type="submit">
                    Create
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
};

const createUser = gql`
  mutation createUser($firstName: String!, $lastName: String!, $email: String!) {
    createUser(input: {firstName: $firstName, lastName: $lastName, email: $email}) {
      id
      email
      firstName
      lastName
    }
  }
`;

export default graphql(createUser, {
    props: ({ mutate }) => ({
        createUser: (firstName, lastName, email) =>
            mutate({
                variables: { firstName, lastName, email },
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
})(Submit);