import React from 'react';
import 'graphiql/graphiql.css'
import { ApolloProvider } from "react-apollo";
import { client } from './client'
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";
import _ from 'lodash'
import PseudoLivequery from './PseudoLiveQuery';

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
      <div style={{ display: 'block', width: '100%', height: '100%' }}>
        <div style={{ display: 'block', float: 'left', width: '400px' }}>
          produits a preparer
          <PseudoLivequery query={LIST_ORDER_PRODUCTS} subscription={NEW_ORDER_PRODUCT} updateQuery={(prev, { subscriptionData }) => {
            if(!prev.listOrderProducts.find(op => op.id === subscriptionData.data.newOrderProduct.id)) {
              prev.listOrderProducts.unshift(subscriptionData.data.newOrderProduct)
            }
          }}>
            {(props) => {
              return <table><tbody>{props.data.listOrderProducts.map((orderProduct) => {
                return <tr key={orderProduct.id}><td>{orderProduct.id}</td><td>{orderProduct.state}</td></tr>
              })}</tbody></table>
            }}
          </PseudoLivequery>
        </div>
        <div style={{ display: 'block', float: 'left', width: '400px' }}>
          <AddOrderProductBoucherie />
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
