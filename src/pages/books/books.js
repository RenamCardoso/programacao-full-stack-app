import React, { useEffect, useState } from 'react';
import Select from 'react-select'
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

import './books.css';


function Book() {
  const navigate = useNavigate();

  const [headers] = useState({ Authorization: `Bearer ${localStorage.getItem('token')}` })
  const [books, setBooks] = useState([]);
  const [listAuthors, setListAuthors] = useState([]);
  const [listPublishers, setListPublishers] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [bookId, setBookId] = useState(0);
  const [name, setName] = useState('');
  const [isbn, setIsbn] = useState('');
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [year, setYear] = useState('');

  useEffect(() => {
    api.get('books', { headers })
      .then(response => {
        setBooks(response.data.data);
        api.get('authors', { headers })
          .then(response => {
            setListAuthors(dataToSelect(response.data.data));
          })
        api.get('publishers', { headers })
          .then(response => {
            setListPublishers(dataToSelect(response.data.data));
          })
      }).catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem('token');
          navigate("/login");
        }
      })

  }, [headers]);

  const formatDate = (date) => {
    let dateFormated = new Date(date);
    let year = dateFormated.getFullYear();
    let mounth = String(dateFormated.getMonth() + 1).length === 1 ? '0' + String(dateFormated.getMonth() + 1) : dateFormated.getMonth() + 1;
    let day = String(dateFormated.getDate() + 1).length === 1 ? '0' + String(dateFormated.getDate() + 1) : dateFormated.getDate() + 1;
    return `${day}/${mounth}/${year}`
  }

  const dataToSelect = (data) => {
    return data.map((value) => {
      return { value: value.id, label: value.name }
    })
  };

  const deleteBook = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja deletar o livro?");
    if (confirm) {
      const deletedBook = await api.delete(`/books/${id}`, { headers });
      if (deletedBook.status === 200) {
        setBooks(books.filter((value) => value.id !== id));
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setBookId(0);
    setName('');
    setIsbn('');
    setYear('');
    setAuthors([]);
    setPublishers([]);
  }

  const listOneBook = async (id) => {
    const ListBook = await api.get(`/books/${id}`, { headers });
    const authorsIds = ListBook.data.data.authors.map(author => Number(author.id));
    if (ListBook?.data?.data) {
      setName(ListBook.data.data.name);
      setIsbn(ListBook.data.data.isbn);
      setYear(ListBook.data.data.year);
      setPublishers(listPublishers.find(({ value }) => value === ListBook.data.data.publisherId));
      setAuthors(listAuthors.filter(({ value }) => authorsIds.includes(value)));
    }
  }

  const saveBook = async () => {
    const { ids: authorsIds, names: authorsNames } = authors.reduce((acc, { value, label }) => {
      acc.ids.push(value)
      acc.names.push(label)
      return acc
    }, { ids: [], names: [] })
    const createdBook = await api.post('/books', {
      name,
      isbn,
      year: Number(year),
      authors: authorsIds,
      publisherId: publishers.value
    }, { headers })
    if (createdBook?.data?.data?.id?.length) {
      setBooks([{
        id: createdBook.data.data.id[0],
        name,
        isbn,
        authors: authorsIds.map((value, index) => { return { id: value, name: authorsNames[index] } }),
        publisherId: publishers.value,
        publisher: publishers.label,
        year,
        available: 1
      },
      ...books
      ])
    }
  }

  const updateBook = async (id) => {
    const { ids: authorsIds, names: authorsNames } = authors.reduce((acc, { value, label }) => {
      acc.ids.push(value)
      acc.names.push(label)
      return acc
    }, { ids: [], names: [] })
    const createdBook = await api.patch(`/books/${id}`, {
      name,
      isbn,
      year: Number(year),
      authors: authorsIds,
      publisherId: publishers.value
    }, { headers })
    if (createdBook.status === 200) {
      let updatedlistBooks = books;
      const indexUpdated = books.findIndex((val) => val.id === id);
      updatedlistBooks[indexUpdated] = {
        id: bookId,
        name,
        isbn,
        year: Number(year),
        authors: authorsIds.map((value, index) => { return { id: value, name: authorsNames[index] } }),
        publisherId: publishers.value,
        publisher: publishers.label,
        available: 1
      }
      setBooks([...updatedlistBooks]);
    }
  }

  const rentBook = async (id, name) => {
    const confirm = window.confirm(`Deseja retirar o livro ${name}?`);
    if (confirm) {
      const rentedBook = await api.post('/rents', {
        bookId: id
      }, { headers })
      if (rentedBook.data?.data?.returnDate) {
        if (rentedBook.status === 200) {
          let updatedlistBooks = books;
          const indexUpdated = books.findIndex((val) => val.id === id);
          updatedlistBooks[indexUpdated] = {
            ...updatedlistBooks[indexUpdated],
            available: 0
          }
          setBooks([...updatedlistBooks]);
          window.alert(`${rentedBook.data.msg}, devolver até ${formatDate(rentedBook.data.data.returnDate)}`);
        }
      }
    }
  }

  const returnBook = async (id, name) => {
    const confirm = window.confirm(`Deseja devolver o livro ${name}?`);
    if (confirm) {
      const returnedBook = await api.patch(`/rents/${id}/return`, {}, { headers });
      if (returnedBook.status === 200) {
          let updatedlistBooks = books;
          const indexUpdated = books.findIndex((val) => val.id === id);
          updatedlistBooks[indexUpdated] = {
            ...updatedlistBooks[indexUpdated],
            available: 1
          }
          setBooks([...updatedlistBooks]);
          window.alert(returnedBook.data.msg);
      }
    }
  }


  return (
    <div className="App-books">
      <div>
        <Button color="primary" onClick={() => setModalOpen(true)}>Cadastrar livro</Button>
        <Table dark>
          <thead>
            <tr>
              <th>#</th>
              <th>Nome</th>
              <th>ISBN</th>
              <th>Escritores</th>
              <th>Publicadora</th>
              <th>Ano</th>
              <th>Disponível</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr>
                <td>{book.id}</td>
                <td>{book.name}</td>
                <td>{book.isbn}</td>
                <td>{book.authors.map(author => author.name).join(", ")}</td>
                <td>{book.publisher}</td>
                <td>{book.year}</td>
                <td>{book.available ? "Sim" : "Não"}</td>
                <td>
                  <Button onClick={() => {
                    setBookId(Number(book.id));
                    listOneBook(book.id);
                    setModalOpen(true);
                  }}>Editar</Button>
                  <Button onClick={() => deleteBook(book.id)}>Deletar</Button>
                  <Button
                    color={book.available ? 'success' : 'danger'}
                    onClick={() => {
                      if (book.available) rentBook(book.id, book.name);
                      else returnBook(book.id, book.name);
                    }
                    }
                  >
                    {book.available ? "Retirar" : "Devolver"}
                  </Button>
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
          Cadastrar livro
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
                placeholder="Digite o nome do livro"
                type="text"
                value={name}
                onInput={(e) => { setName(e.target.value) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="isbn">
                ISBN
              </Label>
              <Input
                id="isbn"
                name="password"
                placeholder="ISBN"
                type="text"
                value={isbn}
                onInput={(e) => { setIsbn(e.target.value.replace(/[^0-9]/g, '')) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="year">
                Ano
              </Label>
              <Input
                id="year"
                name="year"
                placeholder="Ano de publicação"
                type="text"
                value={year}
                onInput={(e) => { if (e.target.value.length < 5) setYear(e.target.value.replace(/[^0-9]/g, '')) }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="authors">
                Autores
              </Label>
              <Select
                id="authors"
                name="authors"
                placeholder="Selecione os autores"
                options={listAuthors}
                value={authors}
                onChange={(value) => { setAuthors(value) }}
                isMulti
              />
            </FormGroup>
            <FormGroup>
              <Label for="publisher">
                Editora
              </Label>
              <Select
                id="publisher"
                name="publisher"
                placeholder="selecione a editora"
                options={listPublishers}
                value={publishers}
                onChange={(value) => { setPublishers(value) }}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              if (bookId) updateBook(bookId);
              else saveBook();
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

export default Book;

