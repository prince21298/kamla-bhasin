
const Joi = require('joi');
const Students = require('../models/students');

module.exports = [
  {
    method: 'GET',
    path: '/sample/{name}',
    options: {
      description: 'Print hello message.',
      tags: ['api'],
      validate: {
        params: {
          name: Joi.string(),
        },
      },
      handler: async (request) => {
        const { sampleService } = request.services();

        const helloMessage = await sampleService.helloMessage(request.params.name);
        return helloMessage;
      },
    },
  },
  {
    method: 'POST',
    path: '/sample/sum',
    options: {
      description: 'Addition of two number',
      tags: ['api'],
      validate: {
        payload: {
          a: Joi.number().integer(),
          b: Joi.number().integer(),
        },
      },
      handler: async (request) => {
        const { sampleService } = request.services();

        const student = await sampleService.addition(request.payload);
        return { data: student };
      },
    },
  },
];
