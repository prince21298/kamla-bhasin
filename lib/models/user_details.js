
// const Schwifty = require('schwifty');
const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Students_details extends Model {
  static get tableName() {
    return 'k_details';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      email: Joi.string().required(),
      name: Joi.string(),
      parents_name: Joi.string(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      pin_code: Joi.string(),
      createdAt: Joi.date(),
    });     
  }

  $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
  }
};
