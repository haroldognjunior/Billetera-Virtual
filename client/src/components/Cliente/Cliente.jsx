import React, { useEffect } from "react";
import General from "../General/General.jsx";
import NavBar from "../NavBar/NavBar.jsx";
import "./CSS/client.css";
import { connect, useDispatch } from "react-redux";
import {
  getProfile,
  getWallet,
  getTransactions,
  logout,
} from "../../actions/UserActions";
import BotonLogout from "./BotonLogout.jsx";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

function Cliente({
  usuarioConectado,
  wallet,
  transactions,
  getProfile,
  getWallet,
  getTransactions,
  history,
}) {
  useEffect(() => {
    getProfile();
  }, []);

  const logout_user = () => {
    logout();
  };
  useEffect(() => {
    if (usuarioConectado.id) {
      getWallet(usuarioConectado.id);
      getTransactions(usuarioConectado.id);
    }
  }, [usuarioConectado]);

  function editUser() {
    window.location.replace(
      "http://localhost:3000/update/" + usuarioConectado.id
    );
  }

  return (
    <Container id="contecliente1">
      <Image
        id="headercliente"
        src="https://fotos.subefotos.com/9f8c7e29765088aa544359e1d9d2ca5fo.png"
      ></Image>
      <div className="contecliente2">
        <div className="header">
          <div className="perfil">
            {usuarioConectado ? (
              <div className="divperfil">
                <h2>
                  Hola, <span>{usuarioConectado.firstName}</span>
                  <div className="buttonsUser">
                    <BotonLogout
                      id="blogout"
                      title="Log Out"
                      onClick={(e) => {
                        logout_user();
                      }}
                    />
                  </div>
                </h2>
              </div>
            ) : (
              <h2>
                Hola <span>Usuario</span>
              </h2>
            )}
          </div>
          {usuarioConectado.firstName !== null && (
            <span>
              <div className="saldo">
                {wallet ? <h3>${wallet.balance}</h3> : <h3>$2,002.50</h3>}
                <div className="balance">
                  <h3>Saldo</h3>
                </div>
              </div>
            </span>
          )}
        </div>
        <div className="clientegeneral">
          {usuarioConectado.firstName !== null && (
            <span>
              <General transacciones={transactions} />
              <div id="navbarcont">
                <NavBar />
              </div>
            </span>
          )}
        </div>
        {usuarioConectado.firstName === null && (
          <form id="formvalidation" className="form-signin needs-validation">
            <h1>
              ¡Tu cuenta aún no ha sido activada, por favor, revisa tu mail y
              sigue los pasos para activarla!.
            </h1>
          </form>
        )}
        <Image
          id="footerclient"
          src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
        ></Image>
      </div>
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    usuarioConectado: state.usuario.usuarioConectado,
    wallet: state.usuario.wallet,
    transactions: state.usuario.transactions,
  };
}

export default connect(mapStateToProps, {
  getProfile,
  getWallet,
  getTransactions,
})(Cliente);
