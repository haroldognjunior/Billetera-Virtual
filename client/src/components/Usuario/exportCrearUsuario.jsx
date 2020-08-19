import * as yup from "yup";
import PropTypes from "prop-types";
import React from "react";
import { ErrorMessage, Formik, Form as FormikForm, Field } from "formik";
import { addUser } from "../../actions/UserActions";
import { useDispatch } from "react-redux";
import "./CSS/agregarusuario.css";
import Container from "react-bootstrap/esm/Container";
import Image from "react-bootstrap/Image";

const validations = yup.object().shape({
  email: yup
    .string()
    .required("Ingresa tu mail")
    .email("¡Debes ingresar un mail válido!"),
  password: yup
    .string()
    .min(8, "¡Tu contraseña debe tener al menos 8 carácteres!")
    .required("Ingresa tu contraseña"),
});

const Form = ({ handleSubmit, initialValues }) => {
  const dispatch = useDispatch();
  function handleSubmit(values) {
    dispatch(addUser(values));
  }
  const cancelar = function (e) {
    window.location.replace("http://localhost:3000");
  };
  return (
    <Container id="crearusuario">
      <Image
        id="henrybankcreateuser"
        src="https://fotos.subefotos.com/f807c25bc9510155673fc2acf1d82a39o.png"
      ></Image>
      <div id="usuario">
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validations}
        >
          <FormikForm className="Form">
            <div className="form-group col-md-12">
              <h4>Crear Usuario</h4>
              <div className="Form-Group">
                <Field
                  className="Form-Field"
                  name="email"
                  placeholder="E-mail"
                  type="email"
                />
                <ErrorMessage
                  name="email"
                  className="Form-Error"
                  component="span"
                />
              </div>
              <div className="Form-Group">
                <Field
                  className="Form-Field"
                  name="password"
                  placeholder="Contraseña"
                  type="password"
                />
                <ErrorMessage
                  className="Form-Error"
                  component="span"
                  name="password"
                />
              </div>
              <div className="form-group col-md-6 inicio">
                <input
                  type="submit"
                  className="btn btn-outline-dark"
                  value="Crear Usuario"
                />
                <button
                  type="button"
                  className="btn btn-outline-light"
                  value="Cancelar"
                  onClick={cancelar}
                >
                  Cancelar
                </button>
              </div>
            </div>

            <div className="link">
              <a href="/resetpassword">¿Olvidaste tu contraseña?</a>
              <a href="/">¿Necesitas ayuda?</a>
            </div>
          </FormikForm>
        </Formik>
      </div>
      <Image
        id="footercrearusuario"
        src="https://fotos.subefotos.com/0d5c65b0be7d80bce6ee2187e71c9997o.png"
      ></Image>
    </Container>
  );
};

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
};

export default Form;
