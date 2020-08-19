const server = require("express").Router();
const bcrypt = require("bcrypt");
const { Users, Wallet } = require("../models/index.js");

server.get("/", (req, res) => {
  Users.findAll({
    order: [["id", "ASC"]],
  }).then((result) => {
    res.send(result);
  });
});

server.get("/:id", (req, res) => {
  const { id } = req.params;
  Users.findOne({
    where: { id: id },
  }).then((result) => {
    res.send(result);
  });
});

server.post("/new", async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    identification,
    phone,
    birthDate,
    street,
    city,
    country,
    complemento,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  Users.create({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    identification,
    phone,
    birthDate,
    street,
    city,
    country,
    complemento,
    email_hash: email,
  })
    .then((user) => {
      Wallet.create({
        userId: user.id,
      });
      return res.json(user);
    })
    .catch((err) => {
      if (err.original) res.send(err.original.messageDetail);
      else res.send("Error de validación de datos");
      //res.status(500).json({ err });
    });
});

//Edita un Usuario por ID
server.put("/modify/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Users.findOne({
    where: {
      id: id,
    },
  });
  
  if (user === null) {
    res.status(404).send({
      status: `No se ha encontrado al Usuario especificado. Contacte a su Administrador`,
    });
  } else {
    const {
      firstName,
      lastName,
      identification,
      phone,
      birthDate,
      street,
      city,
      country,
      complemento,
    } = req.body;
    Users.update(
      {
        firstName,
        lastName,
        identification,
        phone,
        birthDate,
        street,
        city,
        country,
        complemento,
      },
      {
        where: {
          id: id,
        },
      }
    )
      .then(() => {
        res.send({
          status: `Sus datos ${user.name} han sido validados correctamente`,
        });
      })
      .catch((err) => {
        if (err.original) res.send(err.original.messageDetail);
        else res.send("Error de validación de datos");
      });
  }
});

//Elimina un Usuario por ID
server.delete("/delete/:id", async (req, res, next) => {
  const { id } = req.params;
  const user = await Users.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Wallet,
        as: "wallet",
      },
    ],
  });
  if (user === null) {
    res.status(404).send({
      status: `No se ha encontrado al Usuario especificado. Contacte a su Administrador`,
    });
  } else {
    const balance = parseFloat(user.wallet.balance);
    if (balance > 0) {
      res.send({
        status: `El Usuario ${user.email} no se puede eliminar; aún tiene un saldo de ${balance} en su cuenta`,
      });
    } else {
      await Users.destroy({
        where: {
          id,
        },
      })
        .then(() => {
          res.send({
            status: `El Usuario ${user.email} ha sido eliminado correctamente`,
          });
        })
        .catch((err) => {
          if (err.original) res.send(err.original.messageDetail);
          else res.send("Error de validación de datos");
        });
    }
  }
});

//Obtener la Billetera de un Usuario
server.get("/wallet/:id", (req, res) => {
  Wallet.findOne({ where: { userId: req.params.id } })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.json({ err });
    });
});

module.exports = server;
