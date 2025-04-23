import React, { useState, useEffect } from 'react';

import { Button, Modal } from 'react-bootstrap';
import { getSousParametreById } from '../../../servicesApi/microservice-parametre';
import { Link } from 'react-router-dom';


function DetailsSousParametre({id}) {

      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);

      const [sousParametreData, setSousParametreData] = useState({
        nom: "",
        description: "",
        createAt: "",
        createBy: "",
        updateAt: "",
        updateBy: "",
        activer: "",
        parametre: {}
      });

      useEffect(() =>{
        handleGetSousParametreById(id);
      },[]);

      const handleGetSousParametreById = (id) => {
            getSousParametreById(id).then(resp => {
              setSousParametreData(resp.data);
            });
      };


        return(
            <>
         
           <Link onClick={handleShow} className="dropdown-item text-info">Détails</Link>
            

           <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Informations d'un sous-paramètre</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {sousParametreData && (
                  <div>
                    <p><strong>Nom :</strong> {sousParametreData.nom || 'N/A'}</p>
                    <p><strong>Description :</strong> {sousParametreData.description || 'N/A'}</p>
                    <p><strong>Activé :</strong> {sousParametreData.activer ? 'Oui' : 'Non'}</p>
                    <p><strong>Créé par :</strong> {sousParametreData.createBy || 'N/A'}</p>
                    <p><strong>Créé le :</strong> {sousParametreData.createAt || 'N/A'}</p>
                    <p><strong>Mis à jour par :</strong> {sousParametreData.updateBy || 'N/A'}</p>
                    <p><strong>Mis à jour le :</strong> {sousParametreData.updateAt || 'N/A'}</p>
                    <hr />
                    {/* Affichage du parametre */}
                    {sousParametreData.parametre && (
                      <div>
                        <p><strong>Paramètre associé :</strong></p>
                        <p><strong>Nom :</strong> {sousParametreData.parametre.nom || 'N/A'}</p>
                        <p><strong>Symbole :</strong> {sousParametreData.parametre.symbole || 'N/A'}</p>
                        <p><strong>Activé :</strong> {sousParametreData.parametre.activer ? 'Oui' : 'Non'}</p>
                        <p><strong>Créé par :</strong> {sousParametreData.parametre.createBy || 'N/A'}</p>
                        <p><strong>Créé le :</strong> {sousParametreData.parametre.createAt || 'N/A'}</p>
                        <p><strong>Mis à jour par :</strong> {sousParametreData.parametre.updateBy || 'N/A'}</p>
                        <p><strong>Mis à jour le :</strong> {sousParametreData.parametre.updateAt || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Fermer
                </Button>
              </Modal.Footer>
            </Modal>

           </>
        );
}

export default DetailsSousParametre;