const Wallet = (sequelize, S) => {
  // defino el modelo
  const W = sequelize.define("wallet", {
    type: {
      type: S.ENUM,
      values: ["Cuenta Corriente", "Cuenta de Ahorro", "Línea de Crédito"],
      defaultValue: "Cuenta Corriente",
    },
    balance: {
      type: S.DECIMAL(10, 2),
      defaultValue: 0.0,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: S.ENUM,
      values: ["Pesos", "Dólares", "Euros"],
      defaultValue: "Pesos",
    },
  });

  return W;
};

module.exports = Wallet;
