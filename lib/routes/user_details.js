const Joi = require('joi');
const { Readable } = require('stream');
const Helpers = require('../helpers');

const Students_details = require('../models/user_details');

const internals = {};  

internals.k_details_Schema = Joi.object({
  email: Students_details.field('email'),
  name: Students_details.field('name'),
  parents_name: Students_details.field('parents_name'),
  address: Students_details.field('address'),
  city: Students_details.field('city'),
  state: Students_details.field('state'),
  pin_code: Students_details.field('pin_code'),
});

module.exports = [  
  {
    method: 'GET',
    path: '/students/details',
    options: {
      auth: {
        strategy:'jwt',
      },
      description: 'Get the list of all the users details and ',
      tags: ['api'],
      handler: async (request) => {
        const {email } = request.auth.credentials;        
        // const email='yousuf19@navgurukul.org'
        const { kDetailsService } = request.services();
        const res = await kDetailsService.verifyRole(email);
        if (res==="SuperAdmin"|| res=="Admin"){
          const students_inof = await kDetailsService.findAll();
            return { data: students_inof };
        }
        else if(res==="Student"){
          const students_inof = await kDetailsService.findByEmail(email);
          return {data:students_inof}
        }
      },
    },
  },
  {
    method: 'POST',
    path: '/students/details',
    options: {
      auth: {
        strategy:'jwt',
      },
      description: 'Create a new user details.',
      tags: ['api'],
      validate: {
        payload: internals.k_details_Schema,
      },
      handler: async (request) => {
        const {email} = request.auth.credentials;
        // const email='rahul19@navgurukul.org'
        const user_email=request.payload['email']
        const { kDetailsService } = request.services();
        const role = await kDetailsService.verifyRole(email);
        if (role === "SuperAdmin" || role === "Admin"){
          const students_inof = await kDetailsService.findByEmail(user_email);
          if (students_inof.length===0){
            const students_inof = await kDetailsService.create(request.payload);
            return students_inof
          }
          else{
            await kDetailsService.userUpdate(user_email, request.payload);
            const user = await kDetailsService.findByEmail(user_email);
            return { data: user };
          }
        } 
        else if(role==="Student"){
          email1=email.trim()
          if (user_email==email1){
            const students_inof = await kDetailsService.findByEmail(email1);
          if (students_inof.length === 0){
            const students_inof = await kDetailsService.create(request.payload);
            return students_inof
          }else{
            await kDetailsService.userUpdate(email1, request.payload);
            const user = await kDetailsService.findByEmail(email1);
            return { data: user };
          }
          }
        }
      },
    },
  },

  {
    method: 'POST',
    path: '/students/details/upload_file/{uploadType}',
    options: {
      description: 'Upload file to S3. Upload type like CSV, PDF or images need to be specified.',
      payload: {
        output: 'stream',
        parse: true,
        maxBytes: 2 * 10000 * 10000,
        allow: 'multipart/form-data',
      },
      tags: ['api'],
      validate: {
        params: {
          uploadType: Joi.string().valid('IMG', 'CSV', 'PDF'),
        },
        payload: {
          file: Joi.object().type(Readable).required().meta({ swaggerType: 'file' }),
        },
      },
      plugins: {
        'hapi-swagger': { payloadType: 'form' },
      },
      handler: async (request) => {
        const fileS3URL = await Helpers.uploadToS3(request.payload.file, request.params.uploadType);
        return { fileUrl: fileS3URL };
      },
    },
  },
];
