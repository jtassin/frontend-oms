// import ApolloClient from "apollo-boost";
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RetryLink } from "apollo-link-retry";

const PORT = '4000';

// Create an http link:
const httpLink = new HttpLink({
    uri: `http://localhost:${PORT}/graphql`
});

// Create a WebSocket link:
export const wsLink = new WebSocketLink({
    uri: `ws://localhost:4001/graphql`,
    options: {
        reconnect: true
    }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    ApolloLink.from([new RetryLink({
        delay: {
            initial: 300,
            max: Infinity,
            jitter: true
        }, attempts: {
            max: 25,
        }
    }), httpLink,])
);

export const client = new ApolloClient({
    //   uri: `http://localhost:${PORT}/graphql`,
    link,
    cache: new InMemoryCache()
});