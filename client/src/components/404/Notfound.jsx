import React from "react";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
//import "./notfound.css";
const NotFound = () => {
  return (
    <Container id="noexiste">
      <div className="containernoexiste">
        <Image
          id="headerresetpass"
          src="https://fotos.subefotos.com/34055884013e08cb2c0036de2bee2946o.png"
        ></Image>
        <h1>
          Uy, llegaste a un lugar conocido sólo por el desarrollador. <br />{" "}
          Vuelve al inicio, por favor.
        </h1>
        <br />
      </div>
    </Container>
  );
};
export default NotFound;
