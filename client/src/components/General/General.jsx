import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./General.css";
import { Link } from "react-router-dom";
import { transactionsHistory, getProfile } from "../../actions/UserActions";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

function General({
  usuarioConectado,
  getProfile,
  transactionsHistory,
  transacciones,
}) {
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <Container id="generalcont">
      <div className="general">
        <h4> General </h4>
      </div>
      <div className="props">
        <div className="income">
          <h5> Ingresos </h5>
          {transacciones ? (
            <h3>${transacciones.income}</h3>
          ) : (
            <h3 className="value"> $ aquí va el valor </h3>
          )}
        </div>
        <div className="expenses">
          <h5> Egresos </h5>
          {transacciones ? (
            <h3>${transacciones.outcome}</h3>
          ) : (
            <h3 className="containervalor"> $ aquí va otro valor </h3>
          )}
        </div>
      </div>
      <div className="record">
        <Button id="recordbtn" href="/transactions/day">
          Diario
        </Button>
        <Button id="recordbtn" href="/transactions/week">
          Semanal
        </Button>
        <Button id="recordbtn" href="/transactions/month">
          Mensual
        </Button>
      </div>
    </Container>
  );
}
function mapStateToProps(state) {
  return {
    usuarioConectado: state.usuario.usuarioConectado,
    transactions: state.usuario.transactions,
  };
}

export default connect(mapStateToProps, { getProfile, transactionsHistory })(
  General
);
