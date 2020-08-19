const Banks = (sequelize, S) => {
  // defino el modelo
  const B = sequelize.define(
    "banks",
    {
      name: {
        type: S.STRING,
        allowNull: false,
      },
      address: {
        type: S.STRING,
        allowNull: false,
      },
      city: {
        type: S.STRING,
        allowNull: false,
      },
      country: {
        type: S.STRING,
        allowNull: true,
      },
      phone: {
        type: S.STRING,
        allowNull: true,
      },
      cuit: {
        type: S.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { timestamps: false }
  );

  return B;
};

module.exports = Banks;