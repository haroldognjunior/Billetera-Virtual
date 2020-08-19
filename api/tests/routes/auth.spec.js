/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('app.js');
const { User } = require('models/index.js');
const sequelize = require('db.js')();

const agent = session(app);
const credentials = {
  email: 'valid@email.com',
  password: 'validPassword',
};

describe('AUTH routes', () => {
  after(() => sequelize.close());
  beforeEach(() => User.sync({ force: true })
    .then(() => User.create(credentials))
    .then(() => agent.post('/auth/login').send(credentials)));
  describe('GET /auth/me', () => {
    
  });
});
