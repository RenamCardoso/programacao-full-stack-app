import React from "react";
import './authors.css';


function Author() {
  return (
    <div className="App-books">
      <div className="btn-book">
        <button>Cadastrar Autor</button>
      </div>
      <div className="card-books">
        <table className="table">
          <thead className="thead">
            <tr className="trHead">
              <th className="th">ID</th>
              <th className="th">Nome</th>
              <th className="th">País</th>
            </tr>
          </thead>
          <tbody className="tbody">
            <tr className="trBody">
              <td className="td">1</td>
              <td className="td">Mark</td>
              <td className="td">Brasil</td>
              <td>
                <button className="btn-us">Editar</button>
              </td>
              <td>
                <button className="btn-us">Deletar</button>
              </td>
            </tr>
            <tr className="trBody">
              <td className="td">1</td>
              <td className="td">Mark</td>
              <td className="td">Brasil</td>
              <td>
                <button className="btn-us">Editar</button>
              </td>
              <td>
                <button className="btn-us">Deletar</button>
              </td>
            </tr>
            <tr className="trBody">
              <td className="td">1</td>
              <td className="td">Mark</td>
              <td className="td">Brasil</td>
              <td>
                <button className="btn-us">Editar</button>
              </td>
              <td>
                <button className="btn-us">Deletar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );  
}

export default Author;

