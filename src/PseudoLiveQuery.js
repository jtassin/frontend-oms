import React from 'react';
import { Query } from "react-apollo";
import { wsLink } from './client';

class SubscribeToMore extends React.Component {
  componentDidMount() {
    this.props.subscribeToMore();
  }

  render() {
    return this.props.children;
  }
}

class RefetchOnWebSocketLoss extends React.Component {
  constructor() {
    super()
    this.state = {
      status: wsLink.subscriptionClient.status,
      refetch: false,
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.status !== wsLink.subscriptionClient.status) {
        this.setState({ status: wsLink.subscriptionClient.status })
      }
    }, 1000)
    wsLink.subscriptionClient.on('reconnected', () => {
      this.setState({ refetch: true })
      this.props.refetch().then(() => {
        this.setState({ refetch: false })
      });
    })
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let borderColor = 'red';
    let text = 'offline'
    if (this.state.refetch) {
      text = 'Resync'
      borderColor = 'orange';
    } else {
      if (this.state.status === 1) {
        text = 'online'
        borderColor = 'green';
      } else if (this.state.status === 0) {
        text = 'pending'
        borderColor = 'orange';
      }
    }
    const style = {
      border: `solid 1px ${borderColor}`
    }
    return <div style={style}>
      <div style={{ width: '100%', backgroundColor: borderColor, textAlign: 'center', color: 'white' }}>
        {text}
      </div>
      {this.props.children}
    </div>;
  }
}

export default class PseudoLivequery extends React.Component {
  render() {
    return <Query
      pollInterval={10*60e3}
      query={this.props.query}
    //   variables={{ repoName: `${params.org}/${params.repoName}` }}
    >
      {({ subscribeToMore, ...result }) => {
        console.log(result)
        if (result.loading) {
          return <div>Loading...</div>
        }
        if (result.error) {
          return <div>Error :/</div>
        }
        return <SubscribeToMore
          {...result}
          subscribeToMore={() =>
            subscribeToMore({
              document: this.props.subscription,
              // variables: { repoName: params.repoName },
              updateQuery: this.props.updateQuery
            })
          }
        >
          <RefetchOnWebSocketLoss refetch={result.refetch}>
            {this.props.children({ ...result })}
          </RefetchOnWebSocketLoss>
        </SubscribeToMore>
      }}
    </Query>
  }
}