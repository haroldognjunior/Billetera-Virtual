import { GET_VALID_USER } from "../constants/userConstants";
import axios from "axios";
import swal from "sweetalert2";
export function getValidUser(id) {
  return (dispatch) => {
    axios.get("http://localhost:3001/users/" + id).then((res) => {
      dispatch({ type: GET_VALID_USER, payload: res.data });
    });
  };
}

export function validEmailUser(email) {
  axios
    .post("http://localhost:3001/auth/validate/resetpassword/", {
      email,
    })
    .then(async (res) => {
      await swal.fire({
        title: "",
        text: "Por favor, verifica tu casilla de correos",
        icon: "success",
        timer: 5000,
      });
    })
    .then((res) => {
      window.location.replace("http://localhost:3000/login");
    })
    .catch(async (error) => {
      await swal.fire({
        text: "Por favor, ingresa un mail válido",
        icon: "error",
      });
    });
}

export function resetPassUser(data) {
  swal
    .fire({
      text: "¡Su contraseña se ha cambiada con exito!",
      icon: "success",
    })
    .then((res) => {
      axios.put("http://localhost:3001/auth/resetpassword/" + data.code, data);
    })
    .then((res) => {
      window.location.replace("http://localhost:3000/login");
    })

    .catch(() => alert("datos invalidos"));
}
