import React, { useState, useEffect } from "react";
import "./enviardinero.css";
import Button from "react-bootstrap/Button";
import { FaUserPlus } from "react-icons/fa";
import { connect } from "react-redux";
import {
  getProfile,
  enviarDinero,
  listaContactos,
} from "../../actions/UserActions";
import SearchContact from "./searchContact.js";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import swal from "sweetalert2";
import axios from "axios";

function EnviarDinero({
  usuarioConectado,
  getProfile,
  enviarDinero,
  listContact,
  listaContactos,
}) {
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (usuarioConectado.contacts) {
      usuarioConectado.contacts.map((value) => {
        listaContactos(value);
      });
    }
  }, [usuarioConectado]);

  useEffect(() => {
    merchantList()
  }, []);

  useEffect(() => {
    bankList()
  }, []);

  const [checked, setChecked] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [transactionType, setTransactionType] = useState(0);
  const [selectedMerchant, setSelectedMerchant] = useState(0);
  const [selectedBank, setSelectedBank] = useState(0);
  const [merchants, setMerchants] = useState([]);
  const [banks, setBanks] = useState([]);

  const addcontactos = function (e) {
    window.location.replace("http://localhost:3000/contactos");
  };

  const merchantList = async () => {
    const response = await axios.get(`http://localhost:3001/merchants`)
    setMerchants(response.data);
  }

  const bankList = async () => {
    const response = await axios.get(`http://localhost:3001/banks`)
    setBanks(response.data);
  }

  const handleChange = (event) => {
    let { value, min, max } = event.target;
    // value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    if (value.length < 8 && value >= 0) setCantidad(value);
  };

  const handleTypeSelection = (event) => {
    let { value } = event.target;
    value = parseInt(value);
    setTransactionType(value);
  };

  const handleMerchantSelection = (event) => {
    let { value } = event.target;
    value = parseInt(value);
    setSelectedMerchant(value);
  };

  const handleBankSelection = (event) => {
    let { value } = event.target;
    value = parseInt(value);
    setSelectedBank(value);
  };

  const volver = function (e) {
    window.location.replace("http://localhost:3000/cliente");
  };

  const transactionTypes = [
    {
      id: 1,
      apiName: "UsertoUser",
      userName: "Transferencia a Cliente"
    },
    {
      id: 2,
      apiName: "UsertoMerchant",
      userName: "Transferencia a Comercio"
    },
    {
      id: 3,
      apiName: "UsertoBank",
      userName: "Transferencia a Banco"
    }
  ];

  return (
    <Container id="enviarcont">
      <Image
        id="headerenviar"
        src="https://fotos.subefotos.com/64bf11a0a60617c000baae47b53883fbo.png ">
      </Image>
      <div id="transactionSelector">
        <select name="transactionSelect" onChange={(e) => handleTypeSelection(e)}>
          <option key={0} value={0}>Seleccione una opción</option>
          {
            transactionTypes.map((transaction) => (
              <option key={transaction.id} value={transaction.id}>
                {transaction.userName}
              </option>
            ))
          }
        </select>
      </div>
      {transactionType === 0 && <h1>Para comenzar a operar, por favor seleccione una opción</h1>}
      {transactionType === 1 &&
        <div>
          <div className="form-group col-md-5 envia">
            <div class="input-group mb-3 destino">
              <div class="input-group-prepend">
                <button class="input-group-text" id="basic-addon1">
                  <FaUserPlus size="30" onClick={addcontactos} />
                </button>
              </div>
              {usuarioConectado.contacts &&
                usuarioConectado.contacts.length !== 0 ? (
                  <SearchContact misContactos={listContact} />
                ) : (
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Aún no tiene contactos"
                    disabled
                  />
                )}
            </div>
            {cantidad == "" ? (
              <div className="total">
                <h1>$0</h1>
              </div>
            ) : (
                <div className="total">
                  <h1>${cantidad}</h1>
                </div>
              )}
            <div class="input-group input-group-sm mb-3">
              <input
                value={cantidad}
                class="form-control mensaje"
                placeholder="Modificar Cantidad"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div class="form-check confirmar">
              <input
                class="form-check-input"
                type="checkbox"
                checked={checked}
                id="defaultCheck1"
                onChange={(e) => {
                  setChecked(e.target.checked);
                }}
              />
              <label class="form-check-label" for="defaultCheck1">
                Acepto usar la sección amigos solo con fines personales, no
                comerciales
          </label>
            </div>
            <div className="send">
              {usuarioConectado.contacts &&
                usuarioConectado.contacts.length !== 0 ? (
                  <Button
                    className="btn btn-dark"
                    id="buttonenviar"
                    size="lg"
                    onClick={() => {
                      if (checked) {
                        if (cantidad > 0) {
                          const nombre = document.getElementById("myInput").value;
                          for (let i = 0; i < listContact.length; i++) {
                            if (listContact[i].nombreContacto === nombre) {
                              enviarDinero(
                                usuarioConectado.id,
                                listContact[i],
                                cantidad,
                                transactionTypes[transactionType - 1].apiName
                              );
                            }
                          }
                        } else {
                          swal.fire({
                            title: "Error",
                            text:
                              "La cantidad a enviar no puede ser 0",
                            icon: "error",
                          });
                        }
                      } else {
                        swal.fire({
                          title: "Error",
                          text:
                            "Debes aceptar la condición de uso para poder enviar dinero",
                          icon: "error",
                        });
                      }
                    }}
                  >
                    Enviar Dinero
                  </Button>
                ) : (
                  <Button
                    className="btn btn-dark"
                    id="buttonatras"
                    href="/cliente" size="lg">
                    Atrás
                  </Button>
                )}
            </div>
            <div>
              <Button
                onClick={volver}
                className="btn btn-dark"
                id="buttonback"
                variant="top"
                size="lg"
              >
                {" "}
            Volver
          </Button>
            </div>
          </div>
          <Image
            id="footerenviar"
            src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
          ></Image>
        </div>
      }
      {transactionType === 2 &&
        <div>
          <div className="form-group col-md-5 envia">
            <div class="input-group mb-3 destino">
              <select name="merchantSelect" onChange={(e) => handleMerchantSelection(e)}>
                <option key={0} value={0}>Seleccione un Comercio</option>
                {
                  merchants.map((merchant) => (
                    <option key={merchant.id} value={merchant.id}>
                      {`${merchant.name} (${merchant.cuit})`}
                    </option>
                  ))
                }
              </select>
            </div>
            {cantidad == "" ? (
              <div className="total">
                <h1>$0</h1>
              </div>
            ) : (
                <div className="total">
                  <h1>${cantidad}</h1>
                </div>
              )}
            <div class="input-group input-group-sm mb-3">
              <input
                value={cantidad}
                class="form-control mensaje"
                placeholder="Modificar Cantidad"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div class="form-check confirmar">
              <input
                class="form-check-input"
                type="checkbox"
                checked={checked}
                id="defaultCheck1"
                onChange={(e) => {
                  setChecked(e.target.checked);
                }}
              />
              <label class="form-check-label" for="defaultCheck1">
                Acepto usar la sección amigos solo con fines personales, no
                comerciales
          </label>
            </div>
            <div className="send">
              {merchants &&
                merchants.length !== 0 ? (
                  <Button
                    className="btn btn-dark"
                    id="buttonenviar"
                    size="lg"
                    onClick={() => {
                      if (checked) {
                        if (cantidad > 0) {
                          enviarDinero(
                            usuarioConectado.id,
                            merchants[selectedMerchant - 1],
                            cantidad,
                            transactionTypes[transactionType - 1].apiName
                          );
                        } else {
                          swal.fire({
                            title: "Error",
                            text:
                              "La cantidad a enviar no puede ser 0",
                            icon: "error",
                          });
                        }
                      } else {
                        swal.fire({
                          title: "Error",
                          text:
                            "Debes aceptar la condición de uso para poder enviar dinero",
                          icon: "error",
                        });
                      }
                    }}
                  >
                    Enviar Dinero
                  </Button>
                ) : (
                  <Button
                    className="btn btn-dark"
                    id="buttonatras"
                    href="/cliente" size="lg">
                    Atrás
                  </Button>
                )}
            </div>
            <div>
              <Button
                onClick={volver}
                className="btn btn-dark"
                id="buttonback"
                variant="top"
                size="lg"
              >
                {" "}
            Volver
          </Button>
            </div>
          </div>
          <Image
            id="footerenviar"
            src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
          ></Image>
        </div>
      }
      {transactionType === 3 &&
        <div>
          <div className="form-group col-md-5 envia">
            <div class="input-group mb-3 destino">
              <select name="bankSelect" onChange={(e) => handleBankSelection(e)}>
                <option key={0} value={0}>Seleccione un Banco</option>
                {
                  banks.map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {`${bank.name} (${bank.cuit})`}
                    </option>
                  ))
                }
              </select>
            </div>
            {cantidad == "" ? (
              <div className="total">
                <h1>$0</h1>
              </div>
            ) : (
                <div className="total">
                  <h1>${cantidad}</h1>
                </div>
              )}
            <div class="input-group input-group-sm mb-3">
              <input
                value={cantidad}
                class="form-control mensaje"
                placeholder="Modificar Cantidad"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div class="form-check confirmar">
              <input
                class="form-check-input"
                type="checkbox"
                checked={checked}
                id="defaultCheck1"
                onChange={(e) => {
                  setChecked(e.target.checked);
                }}
              />
              <label class="form-check-label" for="defaultCheck1">
                Acepto usar la sección amigos solo con fines personales, no
                comerciales
        </label>
            </div>
            <div className="send">
              {banks &&
                banks.length !== 0 ? (
                  <Button
                    className="btn btn-dark"
                    id="buttonenviar"
                    size="lg"
                    onClick={() => {
                      if (checked) {
                        if (cantidad > 0) {
                          enviarDinero(
                            usuarioConectado.id,
                            banks[selectedBank - 1],
                            cantidad,
                            transactionTypes[transactionType - 1].apiName
                          );
                        } else {
                          swal.fire({
                            title: "Error",
                            text:
                              "La cantidad a enviar no puede ser 0",
                            icon: "error",
                          });
                        }
                      } else {
                        swal.fire({
                          title: "Error",
                          text:
                            "Debes aceptar la condición de uso para poder enviar dinero",
                          icon: "error",
                        });
                      }
                    }}
                  >
                    Enviar Dinero
                  </Button>
                ) : (
                  <Button
                    className="btn btn-dark"
                    id="buttonatras"
                    href="/cliente" size="lg">
                    Atrás
                  </Button>
                )}
            </div>
            <div>
              <Button
                onClick={volver}
                className="btn btn-dark"
                id="buttonback"
                variant="top"
                size="lg"
              >
                {" "}
          Volver
        </Button>
            </div>
          </div>
          <Image
            id="footerenviar"
            src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
          ></Image>
        </div>
      }
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    usuarioConectado: state.usuario.usuarioConectado,
    listContact: state.usuario.listContact,
  };
}

export default connect(mapStateToProps, {
  getProfile,
  enviarDinero,
  listaContactos,
})(EnviarDinero);
