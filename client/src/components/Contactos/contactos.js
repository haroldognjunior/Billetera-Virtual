import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getContacts,
  deleteContacts,
  addContact,
} from "../../actions/contactsActions";
import { SELECT_CONTACT } from "../../constants/userConstants";
import "./contactos.css";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { getProfile } from "../../actions/UserActions";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

const Contacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((store) => store.usuario.contacts);
  const userSelected = useSelector((store) => store.usuario.contactSelected);
  const userContected = useSelector((store) => store.usuario.usuarioConectado);

  const [emailValue, setEmailValue] = useState("");

  useEffect(() => dispatch(getProfile()), []);
  useEffect(() => dispatch(getContacts(userContected.id)), [userContected]);

  const selectedUser = (user) => {
    dispatch({ type: SELECT_CONTACT, payload: user });
  };

  const deleteHandler = (email, id) => {
    dispatch(deleteContacts(email, id));
  };

  const addHandler = () => {
    dispatch(addContact(emailValue, userContected.id));
    setEmailValue("");
  };

  const volver = function (e) {
    window.location.replace("http://localhost:3000/enviar");
  };

  return (
    <Container id="contactoscont">
      <Image
        id="logomiscontactos"
        src="https://fotos.subefotos.com/42c7f4c4e2f06d48681a4a5094ca38b5o.png"
      ></Image>
      <div id="contactoscont2" class="row justify-content-center">
        <div class="col-auto">
          <Table id="contactostable" size="lg" borderless="true" hover="true">
            {contacts.length == 0 ? (
              <th>No tiene contactos aún!</th>
            ) : (
              <tbody>
                {contacts.map((contact) => {
                  return (
                    contact.id == userSelected.id ? (
                  <tr id="rowData">
                    <td>
                      {contact.firstName} {contact.lastName}
                    </td>
                    <td onClick={() => selectedUser(contact)}>
                      {contact.email}
                    </td>
                  </tr>
                  ) : (
                    <tr id="rowTable">
                      <td>
                        {contact.firstName} {contact.lastName}
                      </td>
                      <td onClick={() => selectedUser(contact)}>{contact.email}</td>
                    </tr>
                  ))
                  })}
              </tbody>
            )}
          </Table>
        </div>
      </div>
      <div class="btns">
        <input
          id ="inputContacts"
          placeholder="Ingrese email de contacto"
          value={emailValue}
          onChange={(e) => {
            setEmailValue(e.target.value);
          }}
        ></input>

        {userSelected !== "" ? (
          <div id="buttonscont">
            <Button
              className="btn btn-dark"
              id="addbtn"
              variant="top"
              size="lg"
              onClick={() => addHandler()}
            >
              Agregar Contacto
            </Button>
            <Button
              id="elimbtn"
              className="btn btn-dark"
              variant="top"
              size="lg"
              
              onClick={() =>
                deleteHandler(userSelected.email, userContected.id)
              }
            >
              Eliminar Contacto
            </Button>
          </div>
        ) : (
          <div id="buttonscont">
            <Button
              onClick={() => addHandler(contacts.email)}
              id="addbtn"
              className="btn btn-dark"
              variant="top"
              size="lg"
            >
              Agregar Contacto
            </Button>
            <Button
              id="elimbtn"
              disabled
              className="btn btn-dark"
              variant="top"
              size="lg"
            >
              Eliminar Contacto
            </Button>
          </div>
        )}
      </div>
      <div className="volvercont">
        <Button
          onClick={volver}
          id="volverbutton"
          className="btn btn-dark"
          variant="top"
          size="lg"
        >
          {" "}
          Volver a Enviar Dinero
        </Button>
      </div>
      <Image
        id="footercontactos"
        src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
      ></Image>
    </Container>
  );
};

export default Contacts;
