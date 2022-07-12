import React from "react";
import './header.css';
import logo from '../app/logo.svg';
import { Link } from "react-router-dom";

function Menu() {
    return (
        <div>
            <ul className="header">
                <Link to="/home"><img src={logo} className="logo" alt="logo"></img></Link>
                <li><Link to="/books">Livros</Link></li>
                <li><Link to="/authors">Autor</Link></li>
                <li><Link to="/publishers">Publicadora</Link></li>   
                <Link className="button-user" to="/users">Cadastre-se</Link>
                <Link className="button-user" to="/login">Login</Link>                    
            </ul>
        </div>
    );
}

export default Menu;