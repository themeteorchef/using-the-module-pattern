import React from 'react';
import { Table, FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { centsToDollars, howdy } from '../../modules/cents-to-dollars';

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { order: null };

    this.items = [
      { priceInCents: 900, description: 'Light Up Yo-Yo' },
      { priceInCents: 1499, description: 'Rainbow Shoelaces' },
      { priceInCents: 12999, description: 'Pogo Stick' },
    ];

    this.handleProcessOrder = this.handleProcessOrder.bind(this);
  }

  total() {
    return this.items.reduce((accumulator, { priceInCents }) => accumulator + priceInCents, 0);
  }

  handleProcessOrder(event) {
    event.preventDefault();

    const order = {
      name: this.customerName.value,
      email: this.customerEmail.value,
      items: this.items,
    };

    Meteor.call('orders.process', order, (error, response) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        this.setState({ order: response });
        Bert.alert('Thank you for your order!', 'success');
      }
    });
  }

  renderOrderTable(items) {
    return (<Table responsive bordered>
      <thead>
        <tr>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ description, priceInCents }) => (
          <tr key={ description }>
            <td>{ description }</td>
            <td>{ centsToDollars(priceInCents) }</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td className="text-right">Total:</td>
          <td>{ centsToDollars(this.total()) }</td>
        </tr>
      </tfoot>
    </Table>);
  }

  render() {
    return (
      <div className="Index">
        { !this.state.order ? <div className="OrderForm">
          <h4 className="page-header">{ howdy('Doug') } Here's your shopping cart:</h4>
          { this.renderOrderTable(this.items) }
          <form onSubmit={ this.handleProcessOrder }>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <input
                type="text"
                ref={customerName => (this.customerName = customerName)}
                className="form-control"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Email Address</ControlLabel>
              <input
                type="text"
                ref={customerEmail => (this.customerEmail = customerEmail)}
                className="form-control"
              />
            </FormGroup>
            <Button bsStyle="success" type="submit">Place Order</Button>
          </form>
        </div> : <div>
          <h4>Order #{ this.state.order.orderId } placed!</h4>
          <p>Thank you for your purchase, { this.state.order.name } ({ this.state.order.email }). You ordered:</p>
          { this.renderOrderTable(this.state.order.items) }
        </div> }
      </div>
    );
  }
}
