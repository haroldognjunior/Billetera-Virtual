const { User } = require('models');
const { expect } = require('chai');
const sequelize = require('db.js')();

describe('User model', () => {
  before(() => sequelize.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  after(() => sequelize.close());
  describe('Validators', () => {
    beforeEach(() => User.sync({ force: true }));
    describe('email', () => {
      it('should throw an error if its not a valid email', (done) => {
        User.create({
          email: 'NotAValidEmail',
        })
          .then(() => done(new Error('It requires a valid email')))
          .catch(() => done());
      });
      it('should throw an error if its not a valid email', (done) => {
        User.create({
          email: 'not@anEmail',
        })
          .then(() => done(new Error('It requires a valid email')))
          .catch(() => done());
      });
      it('should throw an error if is not a string', (done) => {
        User.create({
          email: [],
        })
          .then(() => done(new Error('It needs only to accept strings')))
          .catch(() => done());
      });
      it('should work when its a valid email', () => {
        User.create({ email: 'valid@email.com' });
      });
    });
    describe('password', () => {
      beforeEach(() => User.sync({ force: true }));
      it('should throw an error if is not a string', (done) => {
        User.create({
          email: 'valid@email.com',
          password: [],
        })
          .then(() => done(new Error('It needs only to accept strings')))
          .catch(() => done());
      });
      it('should throw an error if the password is not larger than 4', (done) => {
        User.create({
          email: 'valid@email.com',
          password: '1',
        })
          .then(() => done(new Error('It needs to be larger than 4')))
          .catch(() => done());
      });
      it('should work when the password is a string larger than 4', () => User.create({
        email: 'valid@email.com',
        password: 'validPassword',
      }));
    });
    describe('state', () => {
      beforeEach(() => User.sync({ force: true }));
      it('should not acccept something that isn\'t `pending`, `active` or `disabled`', (done) => {
        User.create({
          email: 'email@valid.com',
          password: 'validPassword',
          state: 'not valid',
        })
          .then(() => done(new Error('state needs to only be pending, active or disabled.')))
          .catch(() => done());
      });
      it('default state should be `pending`', (done) => {
        User.create({
          email: 'email@valid.com',
        })
          .then((user) => {
            if (user.state === 'pending') return done();
            return done(new Error('default state is not `pending`'));
          })
          .catch(done);
      });
      it('should accept `pending`', () => User.create({
        email: 'valid@email.com',
        password: 'validPassword',
        state: 'pending',
      }));
      it('should accept `disabled`', () => User.create({
        email: 'valid@email.com',
        password: 'validPassword',
        state: 'disabled',
      }));
      it('should accept `active`', () => User.create({
        email: 'valid@email.com',
        password: 'validPassword',
        state: 'active',
      }));
    });
  });
  describe('Default fields', () => {
    beforeEach(() => User.sync({ force: true }));
    it('should have a token', () => {
      User.create({ email: 'valid@email.com' })
        .then((user) => {
          expect(user.dataValues.token.length).to.be.equal(40);
        });
    });
    it('access Level should be 0', () => {
      User.create({ email: 'valid@email.com' })
        .then((user) => {
          expect(user.dataValues.accessLevel).to.be.equal(0);
        });
    });
    it('should not have a token when creating with password', () => User.create({ email: 'valid@email.com', password: 'todobien' })
      .then((user) => {
        expect(user.dataValues.token).to.be.a('null');
      }));
    it('should have state `active` when  creating with password', () => User.create({ email: 'valid@email.com', password: 'todobien' })
      .then((user) => {
        expect(user.dataValues.state).to.be.equal('active');
      }));
  });
  describe('Activation Workflow', () => {
    let token;
    const email = 'valid@email.com';
    const pass = 'validPassword';

    beforeEach(() => User.sync({ force: true }));
    beforeEach(() => User.create({ email })
      .then((u) => {
        ({ token } = u.dataValues);
      }));
    it('should activate an User with a valid password', () => User.activateUser(email, token, pass, 'toni', 'tralice')
      .then((u) => {
        expect(u.dataValues.state).to.be.equal('active');
      }));
    it('should not activate an User with an invalid token', (done) => {
      User.activateUser(email, 'badtoken', pass)
        .then(() => done('should not activate with bad token'))
        .catch(() => done());
    });
  });
  describe('Authentication  Workflow', () => {
    const email = 'valid@email.com';
    const pass = 'validPassword';

    beforeEach(() => User.sync({ force: true }));
    beforeEach(() => User.create({ email, password: pass }));
    it('should login with valid credentials', () => User.authenticate(email, pass)
      .then((u) => {
        expect(u.dataValues.email).to.be.equal(email);
      }));
    it('should  not login with invalid password', () => User.authenticate(email, 'badpass')
      .then((result) => expect(result).to.be.false));
    it('should  not login with invalid email', () => User.authenticate('email@not.com', pass)
      .then((result) => expect(result).to.be.false));
    it('should  not login without password', () => User.authenticate(email)
      .then((result) => expect(result).to.be.false));
    it('should  not login without email', () => User.authenticate()
      .then((result) => expect(result).to.be.false));
  });
});
