import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import processOrder from '../../modules/server/process-order';

Meteor.methods({
  'orders.process': (order) => {
    check(order, Object);
    return processOrder(order);
  },
});
