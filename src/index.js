import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/app/App';
import User from './pages/users/users';
import Login from './pages/users/login'
import Book from './pages/books/books';
import Author from './pages/authors/authors';
import Publisher from './pages/publishers/publishers';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Menu from './components/menu/header';
import Rodape from './components/rodape/footer';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
      <Menu/>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="users" element={<User />} />
        <Route path="authors" element={<Author />} />
        <Route path="publishers" element={<Publisher />} />
        <Route path="login" element={<Login />} />
        <Route path="books" element={<Book />} />
      </Routes>
      <Rodape/>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
