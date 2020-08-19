const server = require("express").Router();
const { Op } = require("sequelize");
const {
  Wallet,
  Transactions,
  Merchants,
  Users,
  Banks,
} = require("../models/index.js");

//do transactions

//cargar dinero//
//De momento no se usará el randomToken para buscar un Comercio;
//Se le puede pasar un ID o un número predefinido como ahora
server.post("/loadBalance/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const valor = req.body;

  var baseDate = new Date();
  baseDate.setMinutes(baseDate.getMinutes() - baseDate.getTimezoneOffset());

  const saldo = await Wallet.findOne({
    where: { userId: idUser },
  });

  const saldoConsolidado =
    parseFloat(saldo.balance) + parseFloat(parseInt(valor.value));
  // const randomToken = function () {
  //   return Math.floor(Math.random() * 5 + 1);
  // };
  const randomTransactionNumber = function () {
    return Math.floor(Math.random() * 500000 + 1);
  };

  await Merchants.findOne({
    where: { id: 1 },
  })
    .then(async (result) => {
      const balanceUpdate = await Wallet.update(
        {
          balance: saldoConsolidado,
        },
        {
          returning: true,
          where: { userId: idUser },
        }
      );
      const transactions = await Transactions.create({
        idSender: 0,
        idReceiver: idUser,
        transactions_type: "Recarga billetera",
        value: parseFloat(parseInt(valor.value)),
        state: "Aceptada",
        transactionNumber: idUser.toString() + randomTransactionNumber(),
        createdAt: baseDate,
      });
      const prom = await Promise.all([result, balanceUpdate, transactions]);
      res.status(200).json(prom);
    })
    .catch(() => {
      res.status(400).json({
        message: "No se pudo cargar el saldo a la billetera",
      });
    });
});

//transferencia de dinero//

server.put("/:idSender/:idReceiver", async (req, res) => {
  let { money, transactions_type } = req.body;
  const { idSender, idReceiver } = req.params;
  const randomTransactionNumber = function () {
    return Math.floor(Math.random() * 500000 + 1);
  };

  const stringSender = idSender.toString();
  const stringReceiver = idReceiver.toString();
  //busqueda de wallets

  let userSender = await Wallet.findOne({ where: { userId: idSender } });
  let moneyFloat = parseFloat(parseInt(money));
  var baseDate = new Date();
  baseDate.setMinutes(baseDate.getMinutes() - baseDate.getTimezoneOffset());

  switch (transactions_type) {
    //Transferencia entre usuarios billetera
    case "UsertoUser":
      let userReceiver = await Wallet.findOne({
        where: { userId: idReceiver },
      });
      let check = await Users.findOne({ where: { id: idReceiver } });
      if (
        check &&
        check.status == "Validado" &&
        userSender.balance >= moneyFloat
      ) {
        Promise.all([userSender, userReceiver])
          .then((users) => {
            //convertir los valores a decimal

            let balanceReceiver = parseFloat(users[1].balance);
            let balanceSender = parseFloat(users[0].balance);
            //suma y resta de montos
            let newBalanceSender = balanceSender - moneyFloat;
            let newBalanceReceiver = balanceReceiver + moneyFloat;

            //updates en las dos billeteras
            let receiver = Wallet.update(
              {
                balance: newBalanceReceiver,
              },
              {
                returning: true,
                where: { userId: idReceiver },
              }
            );
            let send = Wallet.update(
              {
                balance: newBalanceSender,
              },
              {
                returning: true,
                where: { userId: idSender },
              }
            );

            Promise.all([send, receiver])
              .then((promises) => {
                //se registra la transaccion
                Transactions.create({
                  idSender: idSender,
                  idReceiver: idReceiver,
                  transactions_type: "Transferencia a usuario",
                  value: money,
                  state: "Aceptada",
                  transactionNumber:
                    stringSender + stringReceiver + randomTransactionNumber(),
                  createdAt: baseDate,
                })
                  .then((transaccion) =>
                    res.status(200).json({
                      message:
                        "transaccion N°" +
                        transaccion.id +
                        " realizada con exito!",
                      transaccion,
                    })
                  )
                  .catch((err) => {
                    res.status(400).json({
                      message: "No se registro el movimiento",
                    });
                  });
              })

              .catch((err) => {
                res.status(400).json({ message: "Saldo insuficiente." });
              });
          })
          .catch((err) =>
            res.status(400).json({
              message:
                "Usuario no encontrado! por favor ingrese nuevamente los usuarios",
              error: err,
            })
          );
      } else {
        if (!check || check.status !== "Validado") {
          res
            .status(400)
            .json({ message: "El contacto aún no se ha validado" });
        } else {
          res.status(400).json({ message: "No tienes fondos suficientes" });
        }
      }
      break;

    // Compra a comercio
    case "UsertoMerchant":
      let merchants = await Merchants.findOne({ where: { id: idReceiver } });
      //Validacion
      let checkMerch = await Merchants.findOne({ where: { id: idReceiver } });

      if (checkMerch && userSender && userSender.balance >= moneyFloat) {
        Promise.all([userSender, merchants])
          .then((users) => {
            //convertir los valores a decimal
            let moneyFloat = parseFloat(money);
            let balanceSender = parseFloat(users[0].balance);
            //suma y resta de montos
            let newBalanceSender = balanceSender - moneyFloat;

            //updates en las dos billeteras
            Wallet.update(
              {
                balance: newBalanceSender,
              },
              {
                returning: true,
                where: { userId: idSender },
              }
            )
              .then(() => {
                //se registra la transaccion

                Transactions.create({
                  idSender: idSender,
                  idReceiver: idReceiver,
                  transactions_type: "Pago Comercio",
                  value: money,
                  state: "Aceptada",
                  transactionNumber:
                    stringSender + stringReceiver + randomTransactionNumber(),
                  createdAt: baseDate,
                })
                  .then((transaccion) =>
                    res.status(200).json({
                      message:
                        "transaccion N°" +
                        transaccion.id +
                        " realizada con exito!",
                      transaccion,
                    })
                  )
                  .catch((err) => {
                    res.status(400).json({
                      message: "No se registro el movimiento",
                    });
                  });
              })
              .catch((err) => {
                res.status(400).json({ message: "Saldo insuficiente." });
              });
          })
          .catch((err) =>
            res.status(400).json({
              message:
                "Comercio no encontrado! por favor ingrese nuevamente los usuarios",
              error: err,
            })
          );
      } else {
        if (!checkMerch || !userSender) {
          res.json({
            message: "El usuario o comercio no existe o no esta habilitado",
          });
        } else {
          res.json({ message: "El usuario no tiene fondos suficientes" });
        }
      }
      break;

    //Transferencia a CBU
    case "UsertoBank":
      let banks = await Banks.findOne({
        where: { id: idReceiver },
      });
      //Validacion
      let checkBank = await Banks.findOne({ where: { id: idReceiver } });
      if (checkBank && userSender && userSender.balance >= moneyFloat) {
        Promise.all([userSender, banks])
          .then((users) => {
            //convertir los valores a decimal
            let moneyFloat = parseFloat(money);
            let balanceSender = parseFloat(users[0].balance);
            //suma y resta de montos
            let newBalanceSender = balanceSender - moneyFloat;

            //updates en las dos billeteras
            Wallet.update(
              {
                balance: newBalanceSender,
              },
              {
                returning: true,
                where: { userId: idSender },
              }
            )
              .then(() => {
                //se registra la transaccion

                Transactions.create({
                  idSender: idSender,
                  idReceiver: idReceiver,
                  transactions_type: "Transferencia Bancaria",
                  value: money,
                  state: "Aceptada",
                  transactionNumber:
                    stringSender + stringReceiver + randomTransactionNumber(),
                  createdAt: baseDate,
                })
                  .then((transaccion) =>
                    res.status(200).json({
                      message:
                        "transaccion N°" +
                        transaccion.id +
                        " realizada con exito!",
                      transaccion,
                    })
                  )
                  .catch((err) => {
                    res.status(400).json({
                      message: "No se registro el movimiento",
                    });
                  });
              })
              .catch((err) => {
                res.status(400).json({ message: "Saldo insuficiente." });
              });
          })
          .catch((err) =>
            res.status(400).json({
              message:
                "Banco no encontrado! por favor ingrese nuevamente los usuarios",
              error: err,
            })
          );
      } else {
        if (!checkBank || !userSender) {
          res.json({
            message: "El usuario o banco no existe o no esta habilitado",
          });
        } else {
          res.json({ message: "El usuario no tiene fondos suficientes" });
        }
      }

      break;
    default:
      res.json({ message: "No se ha indicado el tipo de operacion." });
      break;
  }
});

//RUTA PARA RETORNAR SUMA GENERAL DE INGRESOS Y EGRESOS X USUARIO//

server.get("/history/:idUser", (req, res) => {
  //busco todas las transacciones del cliente y las separo por ingresos y decrementos
  const { idUser } = req.params;
  let income = Transactions.findAll({
    where: { idReceiver: idUser },
  });
  let outcome = Transactions.findAll({
    where: { idSender: idUser },
  });

  Promise.all([income, outcome])
    .then((transactions) => {
      var ing = 0.0;
      var dec = 0.0;

      transactions[0].forEach((element) => {
        //parseo a Decimal de nuevo ¬¬
        ing = parseFloat(ing) + parseFloat(element.value);
      });

      transactions[1].forEach((element) => {
        dec = parseFloat(dec) + parseFloat(element.value);
      });
      res.status(200).json({ income: ing, outcome: dec });
    })

    .catch((err) =>
      res.status(400).json({ message: "no se pudo realizar la consulta" })
    );
});

//RUTA PARA RETORNAR SUMA GENERAL POR FECHA DE INGRESOS Y EGRESOS X USUARIO//
//Fecha de incorporación a base: 10-08-2020
//Última actualización: 17-08-2020
server.get("/history/time/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const { moment } = req.query;

  async function moneyFlow(start, end, moment) {
    try {
      //busco todas las transacciones del cliente y las separo por ingresos y decrementos
      var income, outcome;
      //Aplicar un Between de Fechas, solo si viene un moment declarado
      if (moment) {
        income = await Transactions.findAll({
          where: {
            idReceiver: idUser,
            createdAt: {
              [Op.between]: [start, end],
            },
          },
          order: [["createdAt", "DESC"]],
        });
        outcome = await Transactions.findAll({
          where: {
            idSender: idUser,
            createdAt: {
              [Op.between]: [start, end],
            },
          },
          order: [["createdAt", "DESC"]],
        });
      }
      //Caso contrario, traer las últimas 5 entradas y salidas de dinero
      else {
        income = await Transactions.findAll({
          where: {
            idReceiver: idUser,
          },
          order: [["createdAt", "DESC"]],
          limit: 5,
        });
        outcome = await Transactions.findAll({
          where: {
            idSender: idUser,
          },
          order: [["createdAt", "DESC"]],
          limit: 5,
        });
      }

      Promise.all([income, outcome])
        .then((transactions) => {
          res.status(200).json({ income, outcome });
        })

        .catch((err) =>
          res.status(400).json({
            message: `No se pudo realizar la consulta de transacciones con rango ${moment}`,
          })
        );
    } catch (error) {
      res.status(404).json({
        message: `Los parámetros de rango de fecha no son correctos. Intente nuevamente`,
      });
    }
  }

  switch (moment) {
    case "day":
      //LA FECHA LE LLEGA POR BODY.DATE EN FORMATO "new Date()"
      var baseDate = new Date();
      //Arreglo de Offset de zona horaria; con esto siempre obtendremos el día actual independiente de donde estemos
      baseDate.setMinutes(baseDate.getMinutes() - baseDate.getTimezoneOffset());
      //Luego, a nuestros rangos le separamos la fecha corregida de la hora, y la seteamos nosotros, de tal forma
      //que siempre busquemos desde el inicio del día de uno hasta el final del otro
      var dayStart = baseDate.toISOString().split("T")[0] + "T00:00:00.000Z";
      var dayEnd = baseDate.toISOString().split("T")[0] + "T23:59:59.999Z";

      moneyFlow(dayStart, dayEnd, "diario");
      break;
    case "week":
      var baseDate = new Date();
      baseDate.setMinutes(baseDate.getMinutes() - baseDate.getTimezoneOffset());
      var pastWeek =
        new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate() - 7
        )
          .toISOString()
          .split("T")[0] + "T00:00:00.000Z";
      var currentDay = baseDate.toISOString().split("T")[0] + "T23:59:59.999Z";

      moneyFlow(pastWeek, currentDay, "semanal");
      break;
    case "month":
      var baseDate = new Date();
      baseDate.setMinutes(baseDate.getMinutes() - baseDate.getTimezoneOffset());
      var pastMonth =
        new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          baseDate.getDate() - 28
        )
          .toISOString()
          .split("T")[0] + "T00:00:00.000Z";
      var currentDay = baseDate.toISOString().split("T")[0] + "T23:59:59.999Z";

      moneyFlow(pastMonth, currentDay, "mensual");
      break;
    case "custom":
      var startDate = req.body.startDate + "T00:00:00.000Z";
      var endDate = req.body.endDate + "T23:59:59.999Z";

      moneyFlow(startDate, endDate, "personalizado");
      break;
    default:
      moneyFlow('', '', '');
      break;
  }
});

module.exports = server;
