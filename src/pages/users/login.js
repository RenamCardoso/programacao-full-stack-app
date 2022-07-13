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

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [msg, setMsg] = useState('');

  const login = () => {
    api.post('/login', {
      username,
      password
    }, { headers }).then((response) => {
      if (response?.data?.data?.token) {
        console.log(response.data.data.token)
        localStorage.setItem('token', response.data.data.token);
        document.querySelectorAll('.internalPages').forEach((el) => el.style.opacity = 1)
            document.querySelectorAll('.externalPages').forEach((el) => el.style.opacity = 0)
        navigate("/");
      }
    }).catch((err) => {
      setMsg(err.response.data.msg)
    });
  }


  return (
    <div className="App-header login">
      <Card>
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
                <Label for="username">
                  Nome de usuário
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Digite seu nome de usuário"
                  type="text"
                  value={username}
                  onInput={(e) => { setUsername(e.target.value) }}
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
            </Form>
          </CardText>
          <Button color="primary" onClick={login} >
            Login
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;

