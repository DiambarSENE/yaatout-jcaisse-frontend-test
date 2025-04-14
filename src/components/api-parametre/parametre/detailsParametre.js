import React, { useState, useEffect } from 'react';
import { Link  } from 'react-router-dom';
import { getParametreById} from '../../../servicesApi/microservice-parametre';

import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';

function DetailsParametre({id}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [toggleIndex, setToggleIndex] = useState(null);

  const [parametreData, setParametreData] = useState({
    nom: "",
    symbole: "",
    createAt: "",
    createBy: "",
    updateAt: "",
    updateBy: "",
    activer: "",
    type: {},
    sousParametres: []
  });

  useEffect( () => {
      handleGetParametreById(id);
  }, []);
  
  const handleGetParametreById = (id) => {
    getParametreById(id).then( resp => {
        setParametreData(resp.data);
    });
  }


  return(
      <>
    
      <Link onClick={handleShow} className="dropdown-item text-info">Détails</Link>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Informations d'un paramètre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {parametreData && (
            <div>
              <p><strong>Nom :</strong> {parametreData.nom || 'N/A'}</p>
              <p><strong>Symbole :</strong> {parametreData.symbole || 'N/A'}</p>
              <p><strong>Activé :</strong> {parametreData.activer ? 'Oui' : 'Non'}</p>
              <p><strong>Créé par :</strong> {parametreData.createBy || 'N/A'}</p>
              <p><strong>Créé le :</strong> {parametreData.createAt || 'N/A'}</p>
              <p><strong>Mis à jour par :</strong> {parametreData.updateBy || 'N/A'}</p>
              <p><strong>Mis à jour le :</strong> {parametreData.updateAt || 'N/A'}</p>

              <hr />

              {/* Affichage du type associé */}
              {parametreData.type && (
                <div>
                  <h5>Type associé :</h5>
                  <p><strong>Nom :</strong> {parametreData.type.nom || 'N/A'}</p>
                  <p><strong>Description :</strong> {parametreData.type.description || 'N/A'}</p>
                  <p><strong>Activé :</strong> {parametreData.type.activer ? 'Oui' : 'Non'}</p>
                  <p><strong>Créé par :</strong> {parametreData.type.createBy || 'N/A'}</p>
                  <p><strong>Créé le :</strong> {parametreData.type.createAt || 'N/A'}</p>
                  <p><strong>Mis à jour par :</strong> {parametreData.type.updateBy || 'N/A'}</p>
                  <p><strong>Mis à jour le :</strong> {parametreData.type.updateAt || 'N/A'}</p>
                </div>
              )}

              <hr />

              {/* Affichage des sous-paramètres */}
              {parametreData.sousParametres && parametreData.sousParametres.length > 0 ? (
                <div>
                  <h5>Sous-paramètres :</h5>
                  {parametreData.sousParametres.map((sous, index) => (
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
                        <strong>{sous.nom || 'Sans nom'}</strong>
                        <span>{toggleIndex === index ? '▲' : '▼'}</span>
                      </div>

                      {toggleIndex === index && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <p><strong>Description :</strong> {sous.description || 'N/A'}</p>
                          <p><strong>Activé :</strong> {sous.activer ? '✅' : '❌'}</p>
                          <p><strong>Créé par :</strong> {sous.createBy || 'N/A'}</p>
                          <p><strong>Créé le :</strong> {sous.createAt || 'N/A'}</p>
                          <p><strong>Mis à jour par :</strong> {sous.updateBy || 'N/A'}</p>
                          <p><strong>Mis à jour le :</strong> {sous.updateAt || 'N/A'}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Aucun sous-paramètre associé.</p>
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

export default DetailsParametre;