import React, { useEffect, useState } from "react";
import './header.css';
import logo from '../app/logo.svg';
import { Link, Navigate, useNavigate } from "react-router-dom";

function Menu() {
    const navigate = useNavigate();


    const [token, setToken] = useState(localStorage.getItem('token'))
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            document.querySelectorAll('.internalPages').forEach((el) => el.style.opacity = 0)
            document.querySelectorAll('.externalPages').forEach((el) => el.style.opacity = 1)
        }
        else {
            document.querySelectorAll('.internalPages').forEach((el) => el.style.opacity = 1)
            document.querySelectorAll('.externalPages').forEach((el) => el.style.opacity = 0)
        }
    }, [token])
    return (
        <div className="header">
            <ul>
                <Link to="/"><img src={logo} className="logo" alt="logo"></img></Link>
                <li><Link to="/books" className="internalPages">Livros</Link></li>
                <li><Link to="/authors" className="internalPages">Autor</Link></li>
                <li><Link to="/publishers" className="internalPages">Editora</Link></li>
                <Link className="button-user externalPages" to="/users">Cadastre-se</Link>
                <Link className="button-user externalPages" to="/login">Login</Link>
                <button
                    className="button-user internalPages"
                    onClick={() => {
                        localStorage.removeItem('token');
                        setToken('');
                        document.querySelectorAll('.internalPages').forEach((el) => el.style.opacity = 1)
                        document.querySelectorAll('.externalPages').forEach((el) => el.style.opacity = 0)
                        navigate("/")
                    }}
                >
                    Desconectar
                </button>
            </ul>
        </div>
    );
}

export default Menu;