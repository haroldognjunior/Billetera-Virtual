import {
  ADD_USER,
  GET_USER_CONTACTS,
  SELECT_CONTACT,
  GET_USER_LOGGED,
  GET_PROFILE,
  GET_WALLET,
  LOGOUT,
  RESET_PASS_USER,
  GET_TRANSACTIONS,
  GET_ADDRESS,
  LISTA_CONTACTOS,
  CARGAR_DINERO,
  GET_VALID_USER,
  TRANSACTIONS_HISTORY,
  ALL_WALLETS,
} from "../constants/userConstants";

const initialState = {
  usuarios: [],
  usuarioConectado: {},
  wallet: {},
  transactions: {},
  listContact: [],
  contacts: [],
  contactSelected: "",
  history: {},
  wallets: [],
};

export default function usuario(state = initialState, action) {
  switch (action.type) {
    case ADD_USER:
      return {
        ...state,
        usuarios: state.usuarios,
      };
    case GET_VALID_USER:
      return {
        ...state,
        usuarios: action.payload,
      };

    case GET_PROFILE:
      return {
        ...state,
        usuarioConectado: action.payload,
      };

    case GET_ADDRESS:
      return {
        ...state,
        usuarioConectado: action.payload,
      };

    case GET_WALLET:
      return {
        ...state,
        wallet: action.payload,
      };

    case GET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.payload,
      };

    case GET_USER_LOGGED:
      return {
        ...state,
        usuarioConectado: action.payload,
      };

    case LOGOUT:
      return {
        ...state,
        usuarios: [],
        usuarioConectado: {},
        wallet: {},
        transactions: {},
      };

    case RESET_PASS_USER:
      return {
        ...state,
        usuarios: state.usuarios,
      };

    case LISTA_CONTACTOS:
      return {
        ...state,
        listContact: state.listContact.concat(action.payload),
      };

    case GET_USER_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };

    case SELECT_CONTACT:
      return {
        ...state,
        contactSelected: action.payload,
      };

    case CARGAR_DINERO:
      return {
        ...state,
        transactions: action.payload,
      };
    case TRANSACTIONS_HISTORY:
      return {
        ...state,
        history: action.payload,
      };
    case ALL_WALLETS:
      return {
        ...state,
        wallets: action.payload,
      };

    default:
      return state;
  }
}
