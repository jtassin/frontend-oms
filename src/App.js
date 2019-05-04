import React from 'react';
import 'graphiql/graphiql.css'
import { ApolloProvider } from "react-apollo";
import { client } from './client'
import { gql } from "apollo-boost";
import { Mutation, Query } from "react-apollo";
import ToPrepare from './ToPrepare';
import SocketState from './SocketState';

const LIST_ORDER_PRODUCTS = gql`
  query listOrderProducts {
    listOrderProducts {
      id
      state
    }
  }
`;

const NEW_ORDER_PRODUCT = gql`
  subscription newOrderProduct {
    newOrderProduct {
      id
      state
    }
  }
`;

const ADD_ORDER_PRODUCT = gql`
  mutation addOrderProduct($articleId: String!, $orderId: String!) {
    addOrderProduct(articleId: $articleId, orderId: $orderId) {
      id
      state
    }
  }
`;

const AddOrderProductBoucherie = () => {
  let input;

  return (
    <Mutation mutation={ADD_ORDER_PRODUCT}>
      {(add, { data }) => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              add({ variables: { articleId: Math.random().toString(36).substring(7), orderId: Math.random().toString(36).substring(7) } });
            }}
          >
            <button type="submit">Add Boucherie product</button>
          </form>
        </div>
      )}
    </Mutation>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          Hi barbie !
      </header>
        <div style={{ display: 'block', width: '100%', height: '100%' }}>
          <div style={{ display: 'block', float: 'left', width: '400px' }}>
            produits a preparer
          <Query
              query={LIST_ORDER_PRODUCTS}
            // variables={{ repoName: `${params.org}/${params.repoName}` }}
            >
              {({ subscribeToMore, ...result }) => (
                <ToPrepare
                  {...result}
                  subscribeToNewProductOrder={() =>
                    subscribeToMore({
                      document: NEW_ORDER_PRODUCT,
                      // variables: { repoName: params.repoName },
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        const newOrderProduct = subscriptionData.data.newOrderProduct;

                        return Object.assign({}, prev, {
                          listOrderProducts: [newOrderProduct, ...prev.listOrderProducts]
                        });
                      }
                    })
                  }
                />
              )}
            </Query>
          </div>
          <div style={{ display: 'block', float: 'left', width: '400px' }}>
            <AddOrderProductBoucherie />
          </div>
          <div style={{ display: 'block', float: 'left', width: '400px' }}><SocketState /></div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
