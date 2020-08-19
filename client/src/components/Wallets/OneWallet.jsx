import React from "react";
import "./Wallets.css";

export default function OneWallet(wallet) {
 
  // a modo de ejemplo :)
  const moneda = {
    Pesos: "$",
    Dolares: "$",
    Euros: "€",
    Libras: "£"
  };

  return (
    <div className="item">
      <div className="props">
        <h5>{wallet.type}</h5>
      </div>
      <div className="props">
        <h5>{wallet.currency}</h5>
      </div>
      <div className="props">
        <h5>{moneda[wallet.currency]}{wallet.balance}</h5>
      </div>
      <div className="props">
        <h5>{wallet.created}</h5>
      </div>
    </div>
  );
}
