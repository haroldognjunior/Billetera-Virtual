const crypto = require("crypto-js");

const Users = (sequelize, S) => {
  // defino el modelo
  const U = sequelize.define(
    "users",
    {
      firstName: {
        type: S.STRING,
        allowNull: true,
      },
      lastName: {
        type: S.STRING,
        allowNull: true,
      },
      password: {
        type: S.STRING,
        allowNull: false,
        validate: {
          min: 6,
        },
      },
      email: {
        type: S.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      identification: {
        type: S.STRING,
        allowNull: true,
        unique: true,
      },
      phone: {
        type: S.STRING,
        allowNull: true,
      },
      birthDate: {
        type: S.DATEONLY,
        allowNull: true,
        validate: {
          isDate: true,
          dateValidator(value) {
            let ageCheck = new Date();
            ageCheck.setFullYear(ageCheck.getFullYear() - 16);
            let birthDate = new Date(value);
            if (ageCheck < birthDate) {
              throw new Error("No esta permitido registrar a Usuarios menores de 16 años");
            }
          }
        },
      },
      street: {
        type: S.STRING,
        allowNull: true,
      },
      city: {
        type: S.STRING,
        allowNull: true,
      },
      country: {
        type: S.STRING,
        allowNull: true,
      },
      complemento: {
        type: S.STRING,
        allowNull: true,
      },
      status: {
        type: S.ENUM,
        values: ["Pendiente", "Validado", "Bloqueado"],
        defaultValue: "Pendiente",
      },
      contacts: {
        type: S.ARRAY(S.INTEGER),
        defaultValue: [],
        allowNull: true,
      },
      email_hash: {
        type: S.STRING,
        allowNull: false,
        get() {
          return this.getDataValue("email_hash");
        },
        set(value) {
          const hashedEmail = crypto
            .SHA3(value, { outputLength: 224 })
            .toString(crypto.enc.Hex);
          this.setDataValue("email_hash", hashedEmail);
        }
      },
      password_hash: {
        type: S.INTEGER,
        allowNull: true,
        get() {
          return this.getDataValue("password_hash");
        },
        set(value) {
          if(typeof value === 'number'){
            const hashedPassword = Math.floor((Math.random() * value) + 1)
            this.setDataValue("password_hash", hashedPassword);
          }
          else {
            this.setDataValue("password_hash", value);
          }
          
        }
      }
    },
    {
      timestamps: false,
    }
  );

  return U;
};

module.exports = Users;
