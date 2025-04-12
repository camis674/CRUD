import React, { useState, useEffect } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import logoCadastro from "./assets/imagem.png";

function App() {
  const baseUrl = "https://localhost:7173/api/Clientes";
  const [data, setData] = useState([]);

  const [modalEditar, setModalEditar] = useState(false);
  const [modalIncluir, setModalIncluir] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);

  const [clienteSelecionado, setClienteSelecionado] = useState({
    id: "",
    name: "",
    idade: "",
    endereco: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClienteSelecionado({
      ...clienteSelecionado,
      [name]: value,
    });
    console.log(clienteSelecionado);
  };

  //-----modal controle do estado
  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir);
  };

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar);
  };

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir);
  };

  const clienteGet = async () => {
    await axios
      .get(baseUrl)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clientePost = async () => {
    delete clienteSelecionado.id;
    await axios
      .post(baseUrl, clienteSelecionado)
      .then((response) => {
        setData(data.concat(response.data));
        abrirFecharModalIncluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clientePut = async () => {

    await axios
      .put(baseUrl + "/" + clienteSelecionado.id, clienteSelecionado)
      .then((response) => {
        var resposta = response.data;
        var dadosAuxiliar = data;
        //eslint-disable-next-line
        dadosAuxiliar.map((cliente) => {
          if (cliente.id === clienteSelecionado.id) {
            cliente.name = resposta.name;
            cliente.idade = resposta.idade;
            cliente.endereco = resposta.endereco;
            cliente.email = resposta.email;
          }
        });
        abrirFecharModalEditar();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clienteDelete = async () => {
    await axios
      .delete(baseUrl + "/" + clienteSelecionado.id)
      .then((response) => {
        setData(data.filter((cliente) => cliente.id !== response.data));
        abrirFecharModalExcluir();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const selecionarCliente = (cliente, caso) => {
    setClienteSelecionado(cliente);
    caso === "Editar" ? abrirFecharModalEditar() : abrirFecharModalExcluir();
  };

  useEffect(() => {
    clienteGet();
  });

  return (
    <div className="cliente-container">
      <br />
      <h3>Cadastro de Clientes</h3>
      <header>
        <img src={logoCadastro} alt="Cadastro" />
        <button
          onClick={() => abrirFecharModalIncluir()}
          className="btn btn-success"
        >
          Incluir Novo Cliente
        </button>
      </header>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Email</th>
            <th>endereco</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.name}</td>
              <td>{cliente.idade}</td>
              <td>{cliente.endereco}</td>
              <td>{cliente.email}</td>

              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => selecionarCliente(cliente, "Editar")}
                >
                  Editar
                </button>{" "}
                {"  "}
                <button
                  className="btn btn-danger"
                  onClick={() => selecionarCliente(cliente, "Excluir")}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalIncluir}>
        <ModalHeader>Incluir Cliente</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Nome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={handleChange}
            />
            <br />
            <label>Idade: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="idade"
              onChange={handleChange}
            />
            <br />
            <label>endereco: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="endereco"
              onChange={handleChange}
            />
            <br />
            <label>Email: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
            />
            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => clientePost()}>
            Incluir
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalIncluir()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar Cliente</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>ID: </label>
            <br />
            <input
              type="text"
              className="form-control"
              readOnly
              value={clienteSelecionado && clienteSelecionado.id}
            />
            <br />
            <label>Nome: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="name"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.name}
            />
            <br />
            <label>Idade: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="idade"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.idade}
            />
            <br />
            <label>endereco: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="endereco"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.endereco}
            />
            <br />
            <label>Email: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="email"
              onChange={handleChange}
              value={clienteSelecionado && clienteSelecionado.email}
            />

            <br />
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={() => clientePut()}>
            Editar
          </button>
          {"   "}
          <button
            className="btn btn-danger"
            onClick={() => abrirFecharModalEditar()}
          >
            Cancelar
          </button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste(a) cliente :{" "}
          {clienteSelecionado && clienteSelecionado.name} ?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={() => clienteDelete()}>
            Sim
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => abrirFecharModalExcluir()}
          >
            Não
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}



export default App;
