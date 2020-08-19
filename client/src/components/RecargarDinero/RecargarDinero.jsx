import React, { useEffect } from "react";
import "./recargardinero.css";
import Button from "react-bootstrap/Button";
import { getProfile, cargarDinero } from "../../actions/UserActions";
import { connect } from "react-redux";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

function CargarDinero(props) {
  const montoARecargar = props.location.state.value;
  useEffect(() => {
    getProfile();
  }, []);

  const handlerSubmit = (e) => {
    cargarDinero(props.usuarioConectado.id, montoARecargar);
  };
  return (
    <Container id="recargardinerocont">
      <Image
        id="headerrecargar"
        src="https://fotos.subefotos.com/aa324d0c240f9d3358f4ddce34a14118o.png"
      ></Image>
      <div className="form-group">
        <div id="pcont">
          <p>
            Usá el siguiente código siempre que quieras depositar dinero en tu
            cuenta. Recordá que el valor mínimo admitido es de $50
          </p>
          <div className="codigo">
            <span> 0800 222 7749</span>
          </div>
          <p>Mostrar el código al cajero en RapiPago o Pago Fácil</p>
        </div>
        <div className="confirmar">
          <Button
            id="buttonrecargar"
            className="btn btn-dark"
            onClick={(e) => handlerSubmit(e)}
          >
            Confirmar Recarga
          </Button>
        </div>
      </div>
      <Image
        id="footerrecargar"
        src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
      ></Image>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    usuarioConectado: state.usuario.usuarioConectado,
  };
}

export default connect(mapStateToProps, { getProfile })(CargarDinero);
