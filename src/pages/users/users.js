import React from "react";
import './users.css'

function User() {
  return (
    <div className="App-header">
      <div className="card">
        <form>
          <div className="fields">
            <label>Nome:</label>
            <input type="text" name="name"></input>
          </div>

          <div className="fields">
          <label>Apelido:</label>
            <input type="text" name="name"></input>
          </div>

          <div className="fields">
          <label>Senha:</label>
            <input type="password" name="name"></input>
          </div>

          <div className="fields">
          <label>Telefone:</label>
            <input type="phone" name="name"></input>
          </div>

          <div className="btn-user">
            <button className="ui-button" type="submit">Registrar-se</button>
          </div>
        </form>
      </div>
    </div>
    );
}

export default User;

