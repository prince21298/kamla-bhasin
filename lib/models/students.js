
// const Schwifty = require('schwifty');
const Joi = require('joi');
const { Model } = require('./helpers');

module.exports = class Students extends Model {
  static get tableName() {
    return 'users';
  }

  static get joiSchema() {
    return Joi.object({
      id: Joi.number().integer().greater(0),
      name: Joi.string().required(),
      email: Joi.string().required(),
      profilePicture: Joi.string().required(),
      googleUserId: Joi.string().required(),
      center: Joi.string(),
      githubLink: Joi.string(),
      linkedinLink: Joi.string(),
      mediumLink: Joi.string()
    });
  }

  $beforeInsert() {
    const now = new Date();
    this.createdat = now;
  }
};
