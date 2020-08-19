import React, { useState } from "react";
import { validEmailUser } from "../../actions/resetPasswordActions";
import "./CSS/resetpassword.css";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

const ResetearContrasena = () => {
  var [email, setEmail] = useState("");

  const handlerClick = () => {
    validEmailUser(email);
  };

  return (
    <Container id="resetpasscontainer">
      <Image
        id="headerresetpass"
        src="https://fotos.subefotos.com/beae292ac669e32496a3b392aadf27e6o.png"
      ></Image>
      <form className="form-signin" onSubmit={(e) => e.preventDefault()}>
        <h1>Ingrese su email: </h1>
        <label htmlFor="contraUser" className="sr-only">
          Constraseña*
        </label>
        <input
          className="form-control"
          required
          type="email"
          placeholder="Email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className=" btn-lg btn-primary btn-block"
          value="Enviar"
          onClick={() => handlerClick()}
        >
          ¡Recibir codigo de validación!
        </button>
      </form>
      <Image
        id="footerresetpass"
        src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
      ></Image>
    </Container>
  );
};

export default ResetearContrasena;
