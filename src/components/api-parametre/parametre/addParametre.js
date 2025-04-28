import React, { useState, useContext } from 'react';
import { createParametre, getParametreByIdType, getParametreByName, getParametres } from '../../../servicesApi/microservice-parametre';
import { ValidationName, ValidationTypes } from '../../../validateur/validation';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Header from '../../templates/header';
import Footer from '../../templates/Footer';
import SideNav from '../../templates/SideNav';
import { AppContext, AppContextParam, AppContextParamByType } from '../../../useContext/context';
import { AppContextIdUserByToken } from '../../../useContext/contextStateUser';


function AddParametre() {
      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      //permet de requiperer l'identifiant de l'utilisateur ensuite de l'utiliser dans le methode d'ajoute
      const {stateIdUserFromToken, setStateIdUserFromToken} = useContext(AppContextIdUserByToken);
      const { stateParametreByType, setStateParametreByType } = useContext(AppContextParamByType);
     const { stateT, setStateT } = useContext(AppContext);

     const [nomError, setNomError] = useState("");
     const [typesError, setTypesError] = useState("");

     const [nom, setNom] = useState("");
     const [symbole, setSymbole] = useState("");
     const [types, setTypes] = useState("");
     const [type, setType] = useState({id : ""});
     const [createBy, setCreateBy] = useState();
     const [activer, setActiver] = useState(false);
     const [erreur, setErreur] = useState("");

     const handleSaveParametre = (e) => {
        e.preventDefault();
        const createBy = stateIdUserFromToken;
        const nomError = ValidationName(nom);
        const typesError = ValidationTypes(type)
        let parametre = { nom, symbole, type, createBy, activer };
        if(!nomError && !typesError){
            createParametre(parametre).then( resp => {
            handleClose();
           // alert(resp.data);
            setNom("");
            setSymbole("");
            setTypes();
            //setCreateBy("");
            setActiver(false);
             
            getParametre();
            
         }).catch(error => {
            console.log("error => ", error);
            setErreur(error.response.data.message);
         })
        }else{
          setNomError(nomError)
          setTypesError(typesError)
        }
        
     };

   const getParametre = () => {
      getParametreByName(nom).then(response => {
         getParametreByIdType(response.data.type.id).then(resp => {

             const currentStateParametreByType = stateParametreByType;
             const updatedParametreByType = [resp.data[resp.data.length - 1], ...currentStateParametreByType];
            //setStateParametreByType(resp.data);
              setStateParametreByType(updatedParametreByType)
         }).catch(error => {
            console.log(error)
         })
      });
        
     };
     
    return(
        <>
     
            <button className="btn btn-primary btn-rounded fs-18" onClick={handleShow}>
               + Ajouter un Paramètre
            </button>
          
            <Modal show={show} onHide={handleClose}>
               <Modal.Header closeButton>
                  <Modal.Title>Ajouter un nouveau paramètre</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                     <form onSubmit={ handleSaveParametre } >
                        <div className="mb-3">
                           <label htmlFor="exampleFormControlInput1" className="form-label">
                           Nom <span style={{color:"red"}}>*</span> :
                           </label>
                           {nomError && <span style={{color:"red"}}>{ nomError }</span> }
                           <input name="nom"
                                 type="text"
                                 value={nom}
                                 onChange={(e) => setNom(e.target.value) }
                                 className="form-control" id="exampleFormControlInput1" placeholder="le nom du parametre"></input>
                           {erreur && <span style={{color:"red"}}>{ erreur }</span> }
                        </div>
                        <div className="mb-3">
                           <label htmlFor="exampleFormControlTextarea1" className="form-label">Symbole :</label>
                           <input name="symbole"
                                    type="text"
                                    value={symbole}
                                    onChange={(e) => setSymbole(e.target.value) }
                                    className="form-control" id="exampleFormControlTextarea1" ></input>
                        </div>
                        <div className="mb-3">
                              <label htmlFor="exampleFormControlTextarea1" className="form-label">
                                 Type <span style={{color:"red"}}>*</span> :
                                 {typesError && <span style={{color:"red"}}>{ typesError }</span> }
                              </label>
                              <select name="types" type="text" value={type.id}
                                 onChange={(e) => setType({id : e.target.value}) }
                                 className="form-control" id="exampleFormControlTextarea1" >
                                    <option value="">Sélectionnez un type</option>
                                    { stateT.map( type =>
                                       <option  value={type.id} key={type.id}>{type.nom}</option>
                                    )}

                              </select>
                        </div>
                        <div className="form-check">
                           <input className="form-check-input" type="checkbox" activer={activer}
                              onChange={(e) => setActiver(e.target.checked) } />
                           <label className="form-check-label" htmlFor="flexCheckChecked">
                              Activer
                           </label>
                        </div>
                        <br/>
                        <div style={{color:"red"}}>Les champs qui ont (*) sont obligatoires</div>
                        <div className="modal-footer">
                              <Button variant="secondary" onClick={handleClose}> Fermer </Button>
                              <button className="btn btn-primary">+ Ajouter</button>
                        </div>
                     </form>
                     </Modal.Body>
               <Modal.Footer>

               </Modal.Footer>
            </Modal>
 
         </>
    );
}

export default AddParametre;