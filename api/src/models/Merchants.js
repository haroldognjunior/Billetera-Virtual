const Merchants = (sequelize, S) => {
    // defino el modelo
    const M = sequelize.define("merchants", {
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
    }, { timestamps: false });
  
    return M;
  };
  
  module.exports = Merchants;
  