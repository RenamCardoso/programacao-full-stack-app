import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';

import api from '../../services/api';

import './authors.css';


function Author() {
  const navigate = useNavigate();

  const [headers] = useState({ Authorization: `Bearer ${localStorage.getItem('token')}` })
  const [authors, setAuthors] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [authorId, setAuthorId] = useState(0);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  

  useEffect(() => {
    api.get('/authors', { headers })
      .then(response => {
        setAuthors(response.data.data);
      }).catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate("/login");
        }
      })
  }, [headers]);


  const deleteAuthor = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja deletar o autor?");
    if (confirm) {
      const deletedBook = await api.delete(`/authors/${id}`, { headers });
      if (deletedBook.status === 200) {
        setAuthors(authors.filter((value) => value.id !== id));
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setAuthorId(0);
    setName('');
    setCountry('');
  }

  const listOneAuthor = async (id) => {
    const ListAuthor = await api.get(`/authors/${id}`, { headers });
    if (ListAuthor?.data?.data) {
      setName(ListAuthor.data.data.name);
      setCountry(ListAuthor.data.data.country);
    }
  }

  const saveAuthor = async () => {
    const createdBook = await api.post('/authors', {
      name,
      country
    }, { headers })
    if (createdBook?.data?.data?.id?.length) {
      setAuthors([{
        id: createdBook.data.data.id[0],
        name,
        country 
      },
      ...authors
      ])
    }
  }

  const updateAuthor = async (id) => {
    const createdBook = await api.patch(`/authors/${id}`, {
      name,
      country
    }, { headers })
    if (createdBook.status === 200) {
      let updatedlistBooks = authors;
      const indexUpdated = authors.findIndex((val) => val.id === id);
      updatedlistBooks[indexUpdated] = {
        id,
        name,
        country
      }
      setAuthors([...updatedlistBooks]);
    }
  }
  return (
    <div className="App-authors">
      <div>
        <Button color="primary" onClick={() => setModalOpen(true)}>Cadastrar Autor</Button>
        <Table dark>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>País</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {authors.map(author => (
              <tr>
                <td>{author.id}</td>
                <td>{author.name}</td>
                <td>{author.country}</td>
                <td>
                  <Button onClick={() => {
                    setAuthorId(Number(author.id));
                    listOneAuthor(author.id);
                    setModalOpen(true);
                  }}>Editar</Button>
                  <Button onClick={() => deleteAuthor(author.id)}>Deletar</Button>
                </td>
              </tr>

            ))}
          </tbody>
        </Table>
      </div>


      <Modal
        isOpen={modalOpen}
        toggle={closeModal}
      >
        <ModalHeader toggle={closeModal}>
          Cadastrar Autor
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="name">
                Nome
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Digite o nome do autor"
                type="text"
                value={name}
                onInput={(e) => { setName(e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="country">
                País
              </Label>
              <Input
                id="country"
                name="password"
                placeholder="País do autor"
                type="text"
                value={country}
                onInput={(e) => { setCountry(e.target.value) }}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              if (authorId) updateAuthor(authorId);
              else saveAuthor();
              closeModal();
            }}
          >
            Salvar
          </Button>
          {' '}
          <Button onClick={closeModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Author;

