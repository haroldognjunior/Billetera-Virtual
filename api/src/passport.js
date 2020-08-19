// var bCrypt = require('bcrypt-nodejs');
const bcrypt = require("bcrypt");
const { Users, Wallet } = require("./models/index.js");

module.exports = function(passport) {
    var LocalStrategy = require('passport-local').Strategy;

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback     
        },
        function(req, email, password, done) {
            Users.findOne({
                where: {
                    email: email
                }
            })
            .then(function(user) {
                if (user) {
                    return done(null, false, {
                        message: 'That email is already taken'
                    });
                } 
                else {
                    const {
                        email,
                        password,
                    } = req.body;
                    const contraseñahash = bcrypt.hashSync(password, 10);
                    Users.create({
                        email,
                        password: contraseñahash,
                        email_hash: email,
                    })
                    .then((user) => {
                        if (!user) {
                            return done(null, false);
                        }
        
                        if (user) {
                            Wallet.create({
                                userId: user.id,
                            });

                            var userinfo = user.get();
                            return done(null, userinfo);
                        }
                    })
                    .catch((err) => {
                        return done(null, false, {
                            message: 'Something went wrong with your Signup'
                        });
                    });
                }
            });
        }
    ));

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            var isValidPassword = function(password, userpass) {
                return bcrypt.compareSync(password, userpass);
            }

            Users.findOne({
                where: {
                    email: email
                },
            })
            .then(function(user) {
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
                //Comprobación de contraseñas
                //1. Si está previamente encriptada del registro, usar la comprobación por hash
                //2. Si no lo está, usar comprobación normal de strings
                if (!isValidPassword(password, user.password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                // if (password !== user.password) {
                //     return done(null, false, {
                //         message: 'Incorrect password.'
                //     });
                // }

                var userinfo = user.get();
                return done(null, userinfo);
            })
            .catch(function(err) {
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            });
        }
    ));

    //serialize
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // deserialize user 
    passport.deserializeUser(function(id, done) {
        Users.findByPk(id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });
}