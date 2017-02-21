/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import Orders from '../../api/orders/orders';
import Invoices from '../../api/invoices/invoices';

const createInvoice = (orderId, items) => {
  try {
    return Invoices.insert({ orderId, items });
  } catch (exception) {
    throw new Meteor.Error('500', `[processOrder.createInvoice] ${exception}`);
  }
};

const createOrder = (order) => {
  try {
    return Orders.insert(order);
  } catch (exception) {
    throw new Meteor.Error('500', `[processOrder.createOrder] ${exception}`);
  }
};

const handler = (options) => {
  try {
    const orderId = createOrder(options);
    const invoiceId = createInvoice(orderId, options);
    return { orderId, invoiceId, ...options };
  } catch (exception) {
    throw new Meteor.Error('500', `[processOrder.handler] ${exception}`);
  }
};

export default handler;
