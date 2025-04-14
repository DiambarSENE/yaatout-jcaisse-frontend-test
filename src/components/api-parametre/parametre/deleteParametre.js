import React, { useState, useContext, useEffect } from 'react';
import {  deleteParametreById, getParametreById } from '../../../servicesApi/microservice-parametre';
import Modal from 'react-bootstrap/Modal';
import {  AppContextParamByType } from '../../../useContext/context';
import { Link } from 'react-router-dom';

function DeleteParametre({id}) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { stateParametreByType, setStateParametreByType } = useContext(AppContextParamByType);

    const [ nom, setNom ] =  useState("");
    const [symbole, setSymbole] = useState("");
    const [ erreur, setErreur ] =  useState("");

      useEffect( () => {
         handleGetParametreById(id);
      }, []);
      
      const handleGetParametreById = (id) => {
        getParametreById(id).then( resp => {
            let parametre = resp.data;
            setNom(parametre.nom);
            setSymbole(parametre.symbole);
        });
      }


    
    const handleDeleteParametre = (e) => {
      e.preventDefault();
      deleteParametreById(id)
          .then(resp =>{
            const newParametres = stateParametreByType.filter((t) => t.id !== id);
            setStateParametreByType(newParametres);
           // alert(resp.data);
          })
          .catch(err => {
            console.log(err);
            setErreur(err.response.data.message);
        });
  };
    
    return(
        <>
     
          <Link onClick={handleShow} className="dropdown-item text-danger">Supprimer</Link>
          

          <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmation de la Suppression</Modal.Title>
              </Modal.Header>
              <Modal.Body>


              <form>

          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Nom:
            </label>
            <input name="nom"
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value) }
                  className="form-control" id="exampleFormControlInput1" placeholder="le nom du parametre" disabled></input>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlTextarea1" className="form-label">Symbole :</label>
            <input  name="symbole"
                    type="text"
                    value={symbole}
                    onChange={(e) => setSymbole(e.target.value) }
                      className="form-control" id="exampleFormControlTextarea1" disabled></input>
          </div>
        
          <div className="modal-footer">
               {erreur && <span style={{ color: 'red' }}>{erreur}</span>}
              <button type="button" className="btn btn-danger light" onClick={handleClose}>Fermer</button>
              <button type="button" className="btn btn-primary" onClick={ handleDeleteParametre}>- Supprimer</button>
              
          </div>
          </form>
              </Modal.Body>
              <Modal.Footer>

              </Modal.Footer>
          </Modal>
      
   </>
    );
}
export default DeleteParametre;