
const Schmervice = require('schmervice');
const _ = require('underscore');
// const CONSTANTS = require('../constants');
// const sendEmail = require('../helpers/sendEmail');

module.exports = class SampleService extends Schmervice.Service {
  async helloMessage(name, txn = null) {
    return `Hello ${name} welcome to navgurukul`;
  }

  async addition(numbers, txn = null) {
    const { a, b } = numbers;
    return `The sum of ${a} and ${b} is ${a + b}`;
  }
};
