import React, { useState, useEffect } from 'react';
import { Link  } from 'react-router-dom';
import { getTypeById } from '../../../servicesApi/microservice-parametre';

import { Button, Modal } from 'react-bootstrap';

function DetailsType({id}) {

      const [show, setShow] = useState(false);
      const handleClose = () => setShow(false);
      const handleShow = () => setShow(true);
      const [toggleIndex, setToggleIndex] = useState(null);

      const [ typeData, setTypeData ] = useState({
        nom: "",
        description: "",
        activer: "",
        createAt: "",
        createBy: "",
        updateAt: "",
        updateBy: "",
        parametres: []
      });


      useEffect(() =>{
        handleGetTypeById(id);
      },[]);

      const handleGetTypeById = (id) => {
            getTypeById(id).then(resp => {
              setTypeData(resp.data);
            });
      };


        return(
            <>
            {/* <Header/>
            <SideNav /> */}
            <Link onClick={handleShow} className="dropdown-item text-info">Détails</Link>
  
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Informations d'un type</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {typeData && (
                  <div>
                    <p><strong>Nom :</strong> {typeData.nom || 'N/A'}</p>
                    <p><strong>Description :</strong> {typeData.description || 'N/A'}</p>
                    <p><strong>Activé :</strong> {typeData.activer ? 'Oui' : 'Non'}</p>
                    <p><strong>Créé par :</strong> {typeData.createBy || 'N/A'}</p>
                    <p><strong>Créé le :</strong> {typeData.createAt || 'N/A'}</p>
                    <p><strong>Mis à jour par :</strong> {typeData.updateBy || 'N/A'}</p>
                    <p><strong>Mis à jour le :</strong> {typeData.updateAt || 'N/A'}</p>
                    <hr />
                    
                    {/* Affichage des paramètres */}
                    {typeData.parametres && typeData.parametres.length > 0 ? (
                      <div>
                        <h5>Paramètres associés :</h5>
                        {typeData.parametres.map((param, index) => (
                          <div
                          key={index}
                          style={{
                            marginBottom: '1rem',
                            padding: '0.5rem',
                            borderLeft: '3px solid #007bff',
                            backgroundColor: '#f9f9f9',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              alignItems: 'center',
                            }}
                            onClick={() => setToggleIndex(toggleIndex === index ? null : index)}
                          >
                            <strong>{param.nom || 'Sans nom'}</strong>
                            <span>{toggleIndex === index ? '▲' : '▼'}</span>
                          </div>
    
                          {toggleIndex === index && (
                            <div style={{ marginTop: '0.5rem' }}>
                            <p><strong>Nom :</strong> {param.nom || 'N/A'}</p>
                            <p><strong>Symbole :</strong> {param.symbole || 'N/A'}</p>
                            <p><strong>Activé :</strong> {param.activer ? 'Oui' : 'Non'}</p>
                            <p><strong>Créé par :</strong> {param.createBy || 'N/A'}</p>
                            <p><strong>Créé le :</strong> {param.createAt || 'N/A'}</p>
                            <p><strong>Mis à jour par :</strong> {param.updateBy || 'N/A'}</p>
                            <p><strong>Mis à jour le :</strong> {param.updateAt || 'N/A'}</p>
                          </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun paramètre associé.</p>
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

export default DetailsType;