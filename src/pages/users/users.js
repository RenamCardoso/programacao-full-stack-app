import { fontSize } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  FormGroup,
  Form,
  Label,
  Card,
  CardHeader,
  CardBody,
  CardText,
  Button,
  Alert
} from 'reactstrap';

import api from '../../services/api';

import './users.css';



function Login() {
  const navigate = useNavigate();

  const [headers] = useState({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [msg, setMsg] = useState('');

  const createAccount = () => {
    if (password === repeatPassword) {
      api.post('/users', {
        name,
        username,
        phone: Number(phone),
        password
      }, { headers }).then((response) => {
        if (response?.data?.data?.id) {
          api.post('/login', {
            username,
            password
          }).then((response) => {
            console.log(response.data.data.id)
            localStorage.setItem('token', response.data.data.token);
            document.querySelectorAll('.internalPages').forEach((el) => el.style.opacity = 1)
            document.querySelectorAll('.externalPages').forEach((el) => el.style.opacity = 0)
            navigate("/");
          })

        }
      }).catch((err) => {
        setMsg(err.response.data.msg)
      })
    }
  }


  return (
    <div className="App-header login">
      <Card className="card">
        <CardHeader>
          Login
        </CardHeader>
        <CardBody className="card-body">
          <CardText>
            <Alert
              className="alert"
              color="danger"
              isOpen={msg}
            >
              {msg}
            </Alert>
            <Form>
              <FormGroup>
                <Label for="name">
                  Nome completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome de completo"
                  type="text"
                  value={name}
                  onInput={(e) => { setName(e.target.value) }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="username">
                  Nome de usuário
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Crie um nome de usuário"
                  type="text"
                  value={username}
                  onInput={(e) => { setUsername(e.target.value) }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="phone">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Digite seu telefone"
                  type="text"
                  value={phone}
                  onInput={(e) => { setPhone(e.target.value) }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">
                  Senha
                </Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Digite sua senha"
                  type="password"
                  value={password}
                  onInput={(e) => { setPassword(e.target.value) }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="repeatPassword">
                  Repetir senha
                </Label>
                <Input
                  id="repeatPassword"
                  name="repeatPassword"
                  placeholder="Repita a sua senha"
                  type="password"
                  value={repeatPassword}
                  onInput={(e) => { setRepeatPassword(e.target.value) }}
                />
              </FormGroup>
            </Form>
          </CardText>
          <Button color="primary" onClick={createAccount} >
            Login
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;

