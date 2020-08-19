import { GET_USER_CONTACTS } from '../constants/userConstants'
import axios from 'axios'
import Swal from 'sweetalert2';

export function getContacts(id) {
  return function (dispatch) {
    axios.get(`http://localhost:3001/contacts/${id}`)
      .then((res) => {
        if (res.status === 200) {
          return dispatch({
            type: GET_USER_CONTACTS,
            payload: res.data.contactos,
          })
        } else {
          alert(res.message);
        }
      })
  }
}


export function addContact(email, id) {
  return function (dispatch) {
    axios.post(`http://localhost:3001/contacts/${id}/addContact`, { email })
      .then(() => {
        axios.get(`http://localhost:3001/contacts/${id}`)
          .then((response) => {
            return dispatch({
              type: GET_USER_CONTACTS,
              payload: response.data.contactos
            })
          })
      })
      .catch(res => {
        Swal.fire({
          title: 'Error',
          text: 'El email ingresado no corresponde a un cliente de Henry',
          icon: 'warning',
        })
      })
  }
}

export function deleteContacts(email, id) {
  return function (dispatch) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Esto eliminará el contacto ${email}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        axios.delete(`http://localhost:3001/contacts/${id}/deleteContact/${email}`)
          .then(res => {
            Swal.fire(
              'Eliminado!',
              'Tu contacto ha sido eliminado satisfactoriamente',
              'success'
            )
            axios.get(`http://localhost:3001/contacts/${id}`)
              .then((response) => {
                return dispatch({
                  type: GET_USER_CONTACTS,
                  payload: response.data.contactos
                })
              })
              .catch(res => {
                return dispatch({
                  type: GET_USER_CONTACTS,
                  payload: []
                })
              })
          })

        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Tu contacto NO ha sido eliminado',
          'error'
        )
      }
    })
  }
}