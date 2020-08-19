const server = require("express").Router();
const passport = require("passport");
const axios = require("axios");
const { SMTPClient } = require("emailjs");
const { Users } = require("../models/index.js");
const { GOOGLE_API_KEY } = 'require("../env-config.js");'
const bcrypt = require("bcrypt");

server.post("/changepassword");

server.post(
  "/login",
  function (req, res, next) {
    next();
  },
  passport.authenticate("local-signin"),
  (req, res) => {
    res.send(req.user);
  }
);

server.get("/logout", function (req, res, next) {
  req.logout();
  req.session = null;
  res.sendStatus(200);
});

server.post(
  "/register",
  function (req, res, next) {
    next();
  },
  passport.authenticate("local-signup", {
    // successRedirect: '/login',
    // failureRedirect: '/signup',
    // badRequestMessage: "You must fill in all of the form fields.",
    // failureFlash: true, // allow flash,
    session: false, // prevent auto-login
  }),
  (req, res) => {
    validateEmail(req.user.email, req.user.email_hash);
    res.send(req.user);
  }
);

//Validar y continuar con el registro de un Usuario.
server.get("/validate/account/:email_hash", async (req, res) => {
  const user = await Users.findOne({
    where: { email_hash: req.params.email_hash },
  });
  if (user === null) {
    res.status(404).send({
      status: `No se ha encontrado al Usuario especificado. Contacte a su Administrador`,
    });
  } else {
    switch (user.status) {
      case "Pendiente":
        user.update({
          status: "Validado",
        });
        res.redirect(`http://localhost:3000/new/${user.id}`);
        res.send({
          status: `El Usuario ${user.email} ha sido validado correctamente`,
        });
        break;
      case "Validado":
        res.send({ status: `El Usuario ${user.email} ya está validado` });
        break;
      case "Bloqueado":
        res.send({
          status: `El Usuario ${user.email} se encuentra bloqueado. Contacte a su Administrador`,
        });
        break;
      default:
        res.send({ status: `Acción no válida. Contacte a su Administrador` });
        break;
    }
  }
});

//Normalizar una Dirección
server.post("/validate/street", async (req, res) => {
  const { street, city, country } = req.body;
  var input = `${street ? street : ""} ${city ? city : ""} ${
    country ? country : ""
  }`.trim();
  await axios
    .get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
      params: {
        key: GOOGLE_API_KEY,
        input,
        language: "es",
      },
    })
    .then((response) => {
      switch (response.data.status) {
        case "OK":
          const results = response.data.predictions;
          var addressArr = [];
          results.forEach((r) => {
            var streetArr = r.description.split(",");
            var street = streetArr[0];
            var city = streetArr[streetArr.length - 2];
            var country = streetArr[streetArr.length - 1];
            addressArr.push({ address: r.description, street, city, country });
          });
          res.json(addressArr);
          break;
        case "ZERO_RESULTS":
          res.status(404).json({
            status: "Sin resultados. Intente usar términos más específicos",
          });
          break;
        default:
          res.status(500).json({
            status: "Ha ocurrido un error. Contacte a su Administrador",
          });
          break;
      }
    });
});

server.get("/me");
server.get("/profileuser", (req, res) => {
  Users.findOne({
    where: {
      id: req.user.id,
    },
  }).then((result) => {
    if (result === null) {
      res.send("el usuario no ha sido encontrado");
    } else {
      res.send(result);
    }
  });
});

//Administrador puede cambiar status de usuario.
server.put("/changestatus/", (req, res) => {
  Users.findOne({
    where: {
      id: req.body.id,
    },
  }).then((user) => {
    user.update({
      status: req.body.status,
    });
    res.send(user);
  });
});

function isLoggedIn(req, res, next) {
  // console.log("###### Parámetro req del isLoggedIn ######");
  // console.log(req);
  if (req.isAuthenticated()) {
    console.log("###### Propiedad session del isLoggedIn ######");
    console.log(req.session);
    var user = {
      id: req.session.passport.user,
      isLoggedIn: req.isAuthenticated(),
    };
    console.log("###### Variable user del isLoggedIn ######");
    console.log(user);
    return next();
  }
  res.redirect("/login");
}

function validateEmail(email, email_hash) {
  const valUrl = `http://localhost:3001/auth/validate/account/${email_hash}`;

  const client = new SMTPClient({
    user: "henrybank@mauricioarizaga.com.ar",
    password: "Henrybank12345",
    host: "smtp.hostinger.com.ar",
    ssl: false,
    port: 587,
  });

  const message = {
    alternative: true,
    text: `Bienvenid@. Se adjunta enlace para validar y continuar con el registro: ${valUrl}`,
    from: "Henry Bank FT02 <henrybank@mauricioarizaga.com.ar>",
    to: `Nuevo Usuario <${email}>`,
    // cc: 'else <else@your-email.com>',
    subject: "Henry Bank - Validación de Usuario",
  };

  // send the message and get a callback with an error or details of the message that was sent
  client.send(message, function (err, message) {
    //console.log(err || message);
  });
}

function resetPassword(email, req, res) {
  Users.update(
    {
      password_hash: 1000000,
    },
    {
      returning: true,
      where: { email: email },
    }
  ).then((user) => {
    // const valUrl = `http://localhost:3001/auth/resetpassword/${hash}`;
    console.log(user[1][0]);
    const ressetLink = "http://localhost:3000/resetpassword/" + user[1][0].id;
    const client = new SMTPClient({
      user: "henrybank@mauricioarizaga.com.ar",
      password: "Henrybank12345",
      host: "smtp.hostinger.com.ar",
      ssl: false,
      port: 587,
    });

    const message = {
      text: `Se adjunta codigo para resetear contraseña: ${user[1][0].password_hash}, ingresa tu clave aqui: ${ressetLink}`,
      from: "Henry Bank FT02 <henrybank@mauricioarizaga.com.ar>",
      to: `Reset password <${email}>`,
      // cc: 'else <else@your-email.com>',
      subject: "Henry Bank - RESET PASSWORD",
    };

    // send the message and get a callback with an error or details of the message that was sent
    client.send(message, function (err, message) {
      //console.log(err || message);
    });

    res.json(user).sendStatus(200);
  });
}

server.post("/validate/resetpassword", (req, res) => {
  resetPassword(req.body.email, req, res);
});

server.put("/resetpassword/:hash", (req, res) => {
  const hash = req.params.hash;
  const { newPassword, email } = req.body;
  const contraseñahash = bcrypt.hashSync(newPassword, 10);

  Users.findOne({ where: { email: email, password_hash: hash } })
    .then((user) => {
      Users.update(
        {
          password: contraseñahash,
          password_hash: null,
        },
        {
          returning: true,
          where: { id: user.id },
        }
      );
      res.status(200).json({ message: "Su contraseña ha sido cambiada!" });
    })
    .catch((err) => {
      res.status(404).json({
        message: "El codigo es incorrecto o ocurrio un error, intente de nuevo",
      });
    });
});

module.exports = server;
