import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import {updateParametre, getParametreById, getTypes,  getParametreByIdType} from '../../../servicesApi/microservice-parametre';
import Modal from 'react-bootstrap/Modal';
import { ValidationName, ValidationTypes } from '../../../validateur/validation';
import { AppContext, AppContextParam, AppContextParamByType } from '../../../useContext/context';
import { AppContextIdUserByToken } from '../../../useContext/contextStateUser';

function EditParametre({id}) {
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      //permet de requiperer l'identifiant de l'utilisateur ensuite de l'utiliser dans le methode d'ajoute
      const {stateIdUserFromToken} = useContext(AppContextIdUserByToken);
      const { stateParametreByType, setStateParametreByType } = useContext(AppContextParamByType);
      const { stateT, setStateT } = useContext(AppContext);

      const [nom, setNom ] =  useState("");
      const [symbole, setSymbole] = useState("");
      const [type, setType] = useState({id : ""});
      const [updateBy] = useState(); 
      const [activer, setActiver] = useState(false);

      const [nameError, setNameError] = useState("");
      const [typesError, setTypesError] = useState("");

      useEffect( () => {
         handleGetParametreById(id);
      }, []);
      
      const handleGetParametreById = (id) => {
        getParametreById(id).then( resp => {
            let parametre = resp.data;
            setNom(parametre.nom);
            setSymbole(parametre.symbole);
            setActiver(parametre.activer);

        });
      }

    const handleUpdateParametre = (e) => {
        e.preventDefault();
      
        const nameError = ValidationName(nom);
        const typesError = ValidationTypes(type);
        let parametre = { id, nom, symbole, type, updateBy, activer };
        if(!nameError && !typesError){
          updateParametre(parametre).then( resp =>{
            handleClose();
            setNom("");
            setSymbole("");
            setType("");
            setActiver(false);

             // Mise à jour du paramètre dans la liste
              const updatedList = stateParametreByType.filter(p => p.id !== id); // Supprimer l'ancien
              const updatedParametre = { ...parametre }; // Le nouveau paramètre modifié
              setStateParametreByType([updatedParametre, ...updatedList]); // Ajouter en haut
            })
              .catch((err) => {
                console.log(err)
              });
        }else{
          setNameError(nameError)
          setTypesError(type)
        }
      };


    useEffect(() => {
        handleGetParametre();
    },[]);

    const handleGetParametre = () => {
          getTypes()
          .then( resp => {
              setStateT(resp.data);
      })
      .catch((err) => {
          console.log(err)
      });
    };
   

        return(
            <>
           
           <Link onClick={handleShow} className="dropdown-item text-muted">Modifier</Link>
            

             <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Modification d'un Paramètre</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                        <form onSubmit={ handleUpdateParametre } >

                           <div className="mb-3">
                             <label htmlFor="exampleFormControlInput1" className="form-label">
                                Nom <span style={{color:"red"}}>*</span> :
                                {nameError && <span style={{color:"red"}}>{ nameError }</span> }
                              </label>
                             <input name="nom"
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value) }
                                    className="form-control" id="exampleFormControlInput1" placeholder="le nom du parametre"></input>
                           </div>
                           <div className="mb-3">
                             <label htmlFor="exampleFormControlTextarea1" className="form-label">Symbole :</label>
                             <input  name="symbole"
                                      type="text"
                                      value={symbole}
                                      onChange={(e) => setSymbole(e.target.value) }
                                       className="form-control" id="exampleFormControlTextarea1" ></input>
                           </div>
                           <div className="mb-3">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">
                              Type <span style={{ color: "red"}}>*</span> :
                              { typesError && <span style={{ color: "red"}} >{ typesError }</span>}  
                            </label>
                            <select name="types" type="text" value={type.id}
                              onChange={(e) => setType({id : e.target.value}) }
                              className="form-control" id="exampleFormControlTextarea1" >
                                 { stateT.map( type =>
                                      <option  value={type.id} key={type.id}>{type.nom}</option>
                                   )}

                           </select>          
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
                           <div style={{color:"red"}}>Les champs qui ont (*) sont obligatoires</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger light" onClick={handleClose}>Fermer</button>
                                <button className="btn btn-primary" >Modifier</button>
              
                            </div>
                        </form>
                        </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
          </Modal>
         
        </>
        );
}

export default EditParametre;