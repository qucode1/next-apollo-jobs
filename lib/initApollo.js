import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, from } from "apollo-link"
import { InMemoryCache } from 'apollo-cache-inmemory'
import queryString from 'query-string';
import omitBy from 'lodash/omitBy';
import isEmpty from 'lodash/isEmpty';
import fetch from 'isomorphic-unfetch'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}


const authLink = new ApolloLink((operation, forward) => {
  const accessToken = process.browser ? localStorage.access_token || '' : ''
  const profileToken = process.browser ? localStorage.profile_token || '' : ''
  operation.setContext(() => ({
    headers: {
      "access_token": accessToken,
      "profile_token": profileToken

    }
  }))
  return forward(operation)
})

const customFetch = (uri, options) => {
  const { body, ...newOptions } = options;
  const parsedBody = JSON.parse(body);
  const command = omitBy(parsedBody, isEmpty);

  if (command.variables) {
    command.variables = JSON.stringify(command.variables);
  }
  const requestedString = uri + "?" + queryString.stringify(command);
  return fetch(requestedString, newOptions);
};

const httpLink = new HttpLink({
  fetchOptions: {
    method: "GET",
    fetch: customFetch
  }
})

function create(initialState) {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: from([authLink, httpLink]),
    //   uri: 'https://api.graph.cool/simple/v1/cixmkt2ul01q00122mksg82pn', // Server URL (must be absolute)
    //   credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
    // }),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
