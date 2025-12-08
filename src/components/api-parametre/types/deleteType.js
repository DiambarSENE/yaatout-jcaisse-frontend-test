import React, { useState, useEffect, useContext } from 'react';
import { deleteType, getTypeById} from '../../../servicesApi/microservice-parametre';
import {  faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import { AppContext } from '../../../useContext/context';
import { Link } from 'react-router-dom';

function DeleteType({id}) {
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      const { stateT, setStateT } = useContext(AppContext);

      const [nom, setNom ] =  useState("");
      const [description, setDescription] = useState("");
      //const [ setUserCreate] = useState("");
      const [activer, setActiver] = useState(false);
      const [erreur, setErreur ] =  useState("");

      useEffect(() =>{
           handleGetTypeById(id);
      },[]);

      const handleGetTypeById = (id) => {
            getTypeById(id).then(resp => {
                 let type = resp.data;
                 setNom(type.nom);
                 setDescription(type.description);
                 //setUserCreate(type.userCreate);
                 setActiver(type.activer);
            });
      };

      const handleDeleteType = (e) => {
          e.preventDefault();

          deleteType(id)
              .then(resp =>{
                const newTypes = stateT.filter((t) => t.id !== id);
                setStateT(newTypes);
               // alert(resp.data);
                handleClose();
              } )
              .catch(err => {
                console.log(err)
                //alert("Vous ne pouvez pas supprimer un type qui est relié avec un parametre.Supprimez d'abord le parametre en premiere")
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
                            <label htmlFor="exampleFormControlInput1" className="form-label">Nom :</label>
                            <input name="nom"
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value) }
                                    className="form-control" id="exampleFormControlInput1" placeholder="le nom du type" disabled></input>
                          </div>
                          <div className="mb-3">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Description :</label>
                            <textarea name="description"
                                      type="text"
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value) }
                                      className="form-control" id="exampleFormControlTextarea1" rows="3" disabled></textarea>
                          </div>
                          
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox"
                              checked={activer}
                              onChange={(e) => setActiver(e.target.checked) } />
                            <label className="form-check-label" htmlFor="flexCheckChecked">
                              Activer
                            </label>
                          </div>
                          <br/>
                            <div className="modal-footer">
                              {erreur && <span style={{ color: 'red' }}>{erreur}</span>}
                              <button type="button" className="btn btn-danger light" onClick={handleClose}>Fermer</button>
                              <button className="btn btn-primary" onClick={ handleDeleteType } >- Supprimer</button>
                            </div>
                        </form>
                        </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
        
           </>
        );
}
export default DeleteType;