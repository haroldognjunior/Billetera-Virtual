import React, { useEffect } from "react";
import {
  resetPassUser,
  getValidUser,
} from "../../actions/resetPasswordActions";
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import "./CSS/validreset.css";

import { useSelector, useDispatch } from "react-redux";

const ValidResetPassword = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.usuario.usuarios);

  var data = {
    email: user.email,
    code: "",
    newPassword: "",
  };

  const id = props.match.params.idUser;

  useEffect(() => dispatch(getValidUser(id)), []);

  const handleKeyChange = (e) => {
    data.code = e.target.value;
  };

  const handlePassChange = (e) => {
    data.newPassword = e.target.value;
  };

  const handlerClick = () => {
    resetPassUser(data);
  };

  return (
    <Container className="containervalid" >
      <Image id="headervalid" src="https://fotos.subefotos.com/f807c25bc9510155673fc2acf1d82a39o.png" ></Image>
      <form className="form-signin" onSubmit={(e) => e.preventDefault()}>
        <h2>Hola {user.firstName}! ingresa el codigo y nueva contraseña</h2>
        <label htmlFor="contraUser" className="sr-only">
          Nueva Constraseña
        </label>
        <input
          className="form-control"
          required
          type="text"
          placeholder="Codigo"
          name="codigo"
          onChange={(e) => handleKeyChange(e)}
        />
        <input
          className="form-control"
          required
          type="password"
          placeholder="Nueva contraseña"
          name="password"
          onChange={(e) => handlePassChange(e)}
        />

        <button
          type="submit"
          className=" btn-lg btn-primary btn-block"
          value="Enviar"
          onClick={() => handlerClick()}
        >
          Confirmar cambio
        </button>
      </form>
    </Container>
  );
};

export default ValidResetPassword;
