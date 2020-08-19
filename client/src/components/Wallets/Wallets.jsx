import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import "./Wallets.css";
import OneWallet from "./OneWallet";
import { AllUserWallets, getProfile } from "../../actions/UserActions";
import Button from "react-bootstrap/Button";
import Container  from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';


function Wallets({ AllUserWallets, getProfile, usuarioConectado, wallets }) {
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (usuarioConectado.id) {
      AllUserWallets(usuarioConectado.id);
    }
  }, [usuarioConectado]);

  const volver = function (e) {
    window.location.replace("http://localhost:3000/cliente");
  };

  return (
    <Container id="wallet">
       <Image id="headerwallet" src="https://fotos.subefotos.com/f807c25bc9510155673fc2acf1d82a39o.png" ></Image>
      <Row>
        <h2>WALLET</h2>
        <Col sm={12}>
          <div className="item">
            <div className="props">
              <h4>Tipo</h4>
            </div>
            <div className="props">
              <h4>Divisa</h4>
            </div>
            <div className="props">
              <h4>Balance</h4>
            </div>
            <div className="props">
              <h4>Fecha Creada</h4>
            </div>
          </div>
          {wallets &&
            wallets.map((e) => (
              <OneWallet
                key={e.id}
                type={e.type}
                currency={e.currency}
                balance={e.balance}
                created={e.created}
              />
            ))}
        </Col>
        <div id="gobackcont">
          <Button 
          onClick={volver} 
          className="goback" 
          variant="top" 
         >
            {" "}
            Volver
          </Button>
        </div>
      </Row>
    </Container>
  );
}
function mapStateToProps(state) {
  return {
    wallets: state.usuario.wallets,
    usuarioConectado: state.usuario.usuarioConectado,
  };
}

export default connect(mapStateToProps, { getProfile, AllUserWallets })(
  Wallets
);
