import React from 'react';
import { wsLink } from './client';

export default class SocketState extends React.Component {
    constructor() {
        super()
        this.state = {
            status: wsLink.subscriptionClient.status,
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState({ status: wsLink.subscriptionClient.status })
        }, 1000)
    }

    componentWillUnmount() {
        this.interval.destroy()
    }

    render() {
        let color = 'red';
        if (this.state.status === 0) {
            color = 'yellow'
        } else if (this.state.status === 1) {
            color = 'green'
        }
        return <span style={{ display: 'block', height: '20px', backgroundColor: color, width: '20px', borderRadius: '15px' }}></span>
    }
}

