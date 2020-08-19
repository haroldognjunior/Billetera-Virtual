import React, { useState, useEffect } from "react";
import "./montoRecarga.css";
import { connect } from "react-redux";
import {
  getProfile,
  enviarDinero,
  listaContactos,
} from "../../actions/UserActions";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

function RecargarDinero({ usuarioConectado, getProfile, listaContactos }) {
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

  const [value, setCantidad] = useState("");

  const handleChange = (event) => {
    let { value, min, max } = event.target;
    // value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    if (value.length < 8 && value >= 0) setCantidad(value);
  };

  const volver = function (e) {
    window.location.replace("http://localhost:3000/cliente");
  };

  return (
    <Container id="recargardinerocont">
      <Image
        id="headerrecargar"
        src="https://fotos.subefotos.com/b24d893ff3163271f9a6fb594aefb84fo.png"
      ></Image>
      <div className="form-group col-md-5 envia">
        {value < 50 ? (
          <div className="alert alert-info alert-dismissible fade show">
            <strong>Info!</strong> El monto minimo de recarga es $50
            <button type="button" className="close" data-dismiss="alert">
              &times;
            </button>
          </div>
        ) : (
          <div></div>
        )}
        {value > 100000 ? (
          <div className="alert alert-info alert-dismissible fade show">
            <strong>Info!</strong> El monto máximo de recarga es $100.000
            <button type="button" className="close" data-dismiss="alert">
              &times;
            </button>
          </div>
        ) : (
          <div></div>
        )}
        {value == "" ? (
          <div className="total">
            <h1>$0</h1>
          </div>
        ) : (
          <div className="total">
            <h1>${value}</h1>
          </div>
        )}

        <div class="input-group input-group-sm mb-3">
          <input
            value={value}
            class="form-control mensaje"
            placeholder="Modificar Cantidad"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <Link
            to={{
              pathname: "/recargar",
              state: { value },
            }}
          >
            {value < 50 || value > 100000 ? (
              <Button className="buttonrecargar" disabled size="lg">
                Recargar
              </Button>
            ) : (
              <Button className="buttonrecargar" size="lg">
                Recargar
              </Button>
            )}
          </Link>
        </div>
        <div>
          <Button
            onClick={volver}
            className="buttongoback"
            variant="top"
            size="lg"
          >
            {" "}
            Volver
          </Button>
        </div>
      </div>
      <Image
        id="footermontorecarga"
        src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
      ></Image>
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
})(RecargarDinero);
