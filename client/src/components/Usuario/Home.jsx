import React from "react";
import "./CSS/home.css";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';



export default function Home() {
  
  return (
    <Container id="contehome1">
      <Image id="henrybankhome" src="https://fotos.subefotos.com/f807c25bc9510155673fc2acf1d82a39o.png" ></Image>
      <div className="contehome2">
        <div className="logconthome">
        <Button className="loginbuttonhome" href="/login" variant="primary"  type="button" >
          Iniciar Sesión
        </Button>
        </div>
        <div className="regconthome">
        <Button className="registerbuttonhome"  href="/registrarse" variant="primary" type="button" >
            Registrarse
        </Button> 
          <a id="ayudahome" href="/">¿Necesitas ayuda?</a>
        </div>
      </div>
      <Image id="footerhome" src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png" ></Image>
    </Container>
  );
}