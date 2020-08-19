/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sequelize = require('db.js')();
const { conn, User } = require('../../src/models/index.js');

describe('User model Methods', () => {
  before(() => {
    sequelize.authenticate()
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      });
  });
  after(() => sequelize.close());
  describe('Forgot Password', () => {
    const email = 'valid@email.com';
    const pass = 'validPassword';
    beforeEach(() => conn.sync({ force: true })
      .then(() => User.create({ email, password: pass })));
    it('should assign a new token', () => User.forgotPassword('valid@email.com')
      .then((user) => {
        expect(user.dataValues.token).not.to.be.a('null');
      }));
    it('should authenticate with old password anyway', () => User.forgotPassword('valid@email.com')
      .then(() => User.authenticate('valid@email.com', 'validPassword')
        .then((response) => {
          expect(response).not.to.be.false;
        })));
    it('should throw an error if the email is not a existing one', (done) => {
      User.forgotPassword('invalid@email.com')
        .then(() => done('should throw an error'))
        .catch(() => { done(); });
    });
  });
  describe('Activation Workflow', () => {
    before(() => {
      sequelize
        .authenticate()
        .catch((err) => {
          console.error('Unable to connect to the database:', err);
        });
    });
    after(() => sequelize.close());
    let token;
    const email = 'valid@email.com';
    const pass = 'validPassword';

    beforeEach(() => User.sync({ force: true }));
    beforeEach(() => User.create({ email })
      .then((u) => {
        ({ token } = u.dataValues);
      }));
    it('should activate an User with a valid password', () => User.activateUser(email, token, pass, 'toni', 'tralice')
      .then((user) => {
        expect(user.dataValues.state).to.be.equal('active');
      }));
    it('should not activate an User with an invalid token', (done) => {
      User.activateUser(email, 'badtoken', pass, 'toni', 'tralice')
        .then(() => {
          done('should not activate with bad token');
        }).catch(() => done());
    });
  });
  describe('Authentication  Workflow', () => {
    const email = 'valid@email.com';
    const pass = 'validPassword';

    beforeEach(() => User.sync({ force: true }));
    beforeEach(() => User.create({ email, password: pass }));
    it('should login with valid credentials', () => User.authenticate(email, pass)
      .then((user) => expect(user.dataValues.email).to.be.equal(email)));
    it('should  not login with invalid password', () => User.authenticate(email, 'badpass')
      .then((result) => expect(result).to.be.false));
    it('should  not login with invalid email', () => User.authenticate('email@not.com', pass)
      .then((result) => expect(result).to.be.false));
    it('should  not login without password', () => User.authenticate(email)
      .then((result) => expect(result).to.be.false));
    it('should  not login without email', () => User.authenticate()
      .then((result) => expect(result).to.be.false));
  });
  describe('Change Password', () => {
    const email = 'valid@email.com';
    const pass = 'validPassword';
    const newPass = 'newPassword';
    beforeEach(() => User.sync({ force: true }));
    beforeEach(() => User.create({ email, password: pass }));
    it('should change password', () => User.changePassword(email, pass, newPass)
      .then((user) => {
        expect(user).not.to.be.false;
      }));
    it('should authenticate with new password', () => User.changePassword(email, pass, newPass)
      .then(() => User.authenticate(email, newPass)
        .then((response) => expect(response).not.to.be.false)));
    it('should not authenticate with old password', () => User.changePassword(email, pass, newPass)
      .then(() => User.authenticate(email, pass)
        .then((response) => expect(response).to.be.false)));
    it('should not changepassword with bad password', (done) => {
      User.changePassword(email, 'pass', newPass)
        .then((user) => done(user))
        .catch(() => done());
    });
    it('should not change password with invalid user', (done) => {
      User.changePassword('email', pass, newPass)
        .then((user) => done(user))
        .catch(() => done());
    });
    it('should not change password  without password', (done) => {
      User.changePassword(email, pass, null)
        .then((user) => done(user))
        .catch(() => done());
    });
  });
});
