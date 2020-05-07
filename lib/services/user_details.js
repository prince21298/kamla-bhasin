const Util = require('util');
const Schmervice = require('schmervice');
const SecurePassword = require('secure-password');
const JWT = require('jsonwebtoken');
const fs = require('fs');
const Dotenv = require('dotenv');
const _ = require('underscore');
const { OAuth2Client } = require('google-auth-library');
const CONSTANTS = require('../constants');
const { role } = require("../config/index");
// const CONSTANTS = require('../constants');
// const sendEmail = require('../helpers/sendEmail');

Dotenv.config({ path: `${__dirname}/../.env` });

module.exports = class KDetailsService extends Schmervice.Service {
  async findById(id, txn) {
    const { Students_details } = this.server.models();
    const user = await Students_details.query(txn).throwIfNotFound().findById(id);
    return user;
  }
  
  async verifyRole(email){
    email= email.trim()
    const { superAdmin, admin } = role; 
    if (superAdmin.includes(email)) {
      return "SuperAdmin"
    } 
    else if (admin.includes(email)) {
      return  "Admin"
    } 
    else {
      return  "Student"
    }
  }
  
  async findAll(txn) {
    const { Students_details } = this.server.models();
    const students_details = await Students_details.query(txn);

    return students_details;
  }

  async findByEmail(email,txn){
    const {Students_details}=this.server.models();
    const user=await Students_details.query(txn).where({'email':email})
    return user
  }

  async create(details, txn) {
    const { Students_details } = this.server.models();
    const students_details = await Students_details.query(txn).insertGraph(details);
    return students_details;
  }

  // update the users deatils if it exist in database.

  async userUpdate(email, k_details, txn) {   
    const details = k_details;
    const { Students_details } = this.server.models();
    const updateUser = await Students_details.query(txn)
      .update(details)
      .where({ email:email});
    return updateUser;
  }
};
