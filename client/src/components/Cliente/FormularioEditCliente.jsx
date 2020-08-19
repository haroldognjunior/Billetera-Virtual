import React, { useState, useEffect } from "react";
import { getUpdateProfile, getProfile } from "../../actions/UserActions";
import { connect } from "react-redux";
import "./CSS/client.css";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

function EditUserForm({ id, getUpdateProfile, usuarioConectado, getProfile }) {
  const [user, setUser] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const address = {
    street: user.street,
    city: user.city,
    country: user.country,
  };

  useEffect(() => {
    getProfile();
  }, []);
  useEffect(() => {
    setUser(usuarioConectado);
  }, [usuarioConectado]);

  const cancelar = function (e) {
    window.location.replace("http://localhost:3000/cliente");
  };

  return (
    <Container id="altaclientecont">
      <Image
        id="headeraltacliente"
        src="https://fotos.subefotos.com/18feda68f26ec2e8e43d1aba90209e83o.png"
      ></Image>
      <form
        id="form-alta"
        onSubmit={(event) => {
          event.preventDefault();

          getUpdateProfile(address, usuarioConectado.id, user);
        }}
      >
        <div class="container-control">
          <input
            class="form-control"
            name="firstName"
            placeholder="Nombre"
            value={user.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            class="form-control"
            name="lastName"
            placeholder="Apellido"
            value={user.lastName}
            onChange={handleInputChange}
            required
          />
          <input
            class="form-control"
            name="identification"
            placeholder="Número"
            value={user.identification}
            onChange={handleInputChange}
            required
          />
          <input
            class="form-control"
            name="phone"
            placeholder="Teléfono"
            value={user.phone}
            onChange={handleInputChange}
            required
          />
          <div id="fecha">
            <p>Fecha de nacimiento</p>
          </div>
          <input
            class="form-control"
            type="date"
            name="birthDate"
            placeholder="Fecha de nacimiento"
            value={user.birthDate}
            onChange={handleInputChange}
            required
          />
          <input
            class="form-control"
            name="street"
            placeholder="Calle y altura"
            value={user.street}
            onChange={handleInputChange}
            required
          />
          <input
            class="form-control"
            name="complemento"
            placeholder="Piso y Depto"
            value={user.complemento}
            onChange={handleInputChange}
          />
          <input
            class="form-control"
            name="city"
            placeholder="Ciudad"
            value={user.city}
            onChange={handleInputChange}
            Address
            required
          />
          <input
            class="form-control"
            name="country"
            placeholder="Pais"
            value={user.country}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="altaButtons">
          <input type="submit" id="buttonalta" value="Modificar datos" />
          <button
            type="button"
            id="buttonalta"
            value="Cancelar"
            onClick={cancelar}
          >
            Cancelar
          </button>
        </div>
      </form>
      <Image
        id="footeralta"
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
export default connect(mapStateToProps, { getUpdateProfile, getProfile })(
  EditUserForm
);
