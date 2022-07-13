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

import './publishers.css';


function Publisher() {
  const navigate = useNavigate();

  const [headers] = useState({ Authorization: `Bearer ${localStorage.getItem('token')}` })
  const [publishers, setPublishers] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [publisherId, setPublisherId] = useState(0);
  const [name, setName] = useState('');
  

  useEffect(() => {
    api.get('/publishers', { headers })
      .then(response => {
        setPublishers(response.data.data);
      }).catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate("/login");
        }
      })
  }, [headers]);


  const deletePublisher = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja deletar a editora?");
    if (confirm) {
      const deletedBook = await api.delete(`/publishers/${id}`, { headers });
      if (deletedBook.status === 200) {
        setPublishers(publishers.filter((value) => value.id !== id));
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setPublisherId(0);
    setName('');
  }

  const listOnePublisher = async (id) => {
    const ListPublishers = await api.get(`/publishers/${id}`, { headers });
    if (ListPublishers?.data?.data) {
      setName(ListPublishers.data.data.name);
    }
  }

  const savePublisher = async () => {
    const createdBook = await api.post('/publishers', {name}, { headers })
    if (createdBook?.data?.data?.id?.length) {
      setPublishers([{
        id: createdBook.data.data.id[0],
        name,
      },
      ...publishers
      ])
    }
  }

  const updatePublisher = async (id) => {
    const createdBook = await api.patch(`/publishers/${id}`, {name}, { headers })
    if (createdBook.status === 200) {
      let updatedlistPublishers = publishers;
      const indexUpdated = publishers.findIndex((val) => val.id === id);
      updatedlistPublishers[indexUpdated] = {
        id,
        name,
      }
      setPublishers([...updatedlistPublishers]);
    }
  }
  return (
    <div className="App-publishers">
      <div>
        <Button color="primary" onClick={() => setModalOpen(true)}>Cadastrar Editora</Button>
        <Table dark>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {publishers.map(publisher => (
              <tr>
                <td>{publisher.id}</td>
                <td>{publisher.name}</td>
                <td>
                  <Button onClick={() => {
                    setPublisherId(Number(publisher.id));
                    listOnePublisher(publisher.id);
                    setModalOpen(true);
                  }}>Editar</Button>
                  <Button onClick={() => deletePublisher(publisher.id)}>Deletar</Button>
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
          Cadastrar Editora
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
                placeholder="Digite o nome da editora"
                type="text"
                value={name}
                onInput={(e) => { setName(e.target.value) }}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              if (publisherId) updatePublisher(publisherId);
              else savePublisher();
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

export default Publisher;

