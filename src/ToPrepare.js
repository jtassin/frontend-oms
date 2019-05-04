import React from 'react';

export default class ToPrepare extends React.Component {
  componentDidMount() {
    this.props.subscribeToNewProductOrder();
  }

  render() {
    console.log(this.props);
    if (this.props.loading) {
      return 'Loading...'
    }
    if (this.props.error) {
      return 'Error...' + this.props.error
    }
    return <table>
      <tbody>
        {this.props.data.listOrderProducts.map((orderProduct) => {
          return <tr key={orderProduct.id}><td>{orderProduct.id}</td><td>{orderProduct.state}</td></tr>
        })}
      </tbody>
    </table>
  }
}

