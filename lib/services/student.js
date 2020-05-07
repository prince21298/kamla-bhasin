
const Util = require('util');
const Schmervice = require('schmervice');
const SecurePassword = require('secure-password');
const JWT = require('jsonwebtoken');
const fs = require('fs');
const Dotenv = require('dotenv');
const _ = require('underscore');
const { OAuth2Client } = require('google-auth-library');
const CONSTANTS = require('../constants');
const { superAdmin ,admin} = require('../config/index');
const { role } = require("../config/index");

// const CONSTANTS = require('../constants');
// const sendEmail = require('../helpers/sendEmail');

Dotenv.config({ path: `${__dirname}/../.env` });

function displayUser({ password, ...user }) {
  return { ...user };
}

module.exports = class StudentService extends Schmervice.Service {
  async findById(id, txn) {
    const { Students } = this.server.models();

    const user = await Students.query(txn).throwIfNotFound().findById(id);
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

  async findByEmail(email,txn){
    const {Students}=this.server.models();
    const user=await Students.query().where({'email':email})
    return user
  }
    
  async findAll(id) {
    const { Students } = this.server.models();
    const students = await Students.query();

    return students;
  }

  async userlogin(txn) {
    const { Students } = this.server.models();
    const students = await Students.query(txn);

    return students;
  }

  async create(details, txn = null) {
    const { Students } = this.server.models();
    const student = await Students.query(txn).insertGraph(details);
    return student;
  }

  async googleLogin(idToken, txn = null) {
    const { Students } = this.server.models();
    const clientId = CONSTANTS.users.auth.googleClientID;
    const client = new OAuth2Client(clientId);
    const response = await client.verifyIdToken({
      idToken: idToken,
      audience: clientId,
    });
    const userObj = { 
      name: response.payload.name,
      email: response.payload.email,
      profilePicture: response.payload.picture,
      googleUserId: response.payload.sub,
    };    
    let user = await Students.query(txn).findOne({ email: userObj.email });
    if (user === undefined) {
      console.log('hello undefined');
      user = await Students.query(txn).insert(userObj);
    } else {
      // console.log(`hello ${user.name}`);
      user = await Students.query(txn).updateAndFetchById(user.id, userObj);
    }
    return user;
  }

  // Create JWT token for authentication purpose.
  async createToken(user) {
    const JWTtoken = await JWT.sign({ id: user.id, email: user.email }, CONSTANTS.users.jwt.secret,
      {
        algorithm: 'HS256',
        expiresIn: CONSTANTS.users.jwt.expiresIn,
      });
    return JWTtoken;
  }
};
