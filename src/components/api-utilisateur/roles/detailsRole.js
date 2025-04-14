import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import {  getRoleById } from '../../../servicesApi/microservice-utilisateur';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function DetailsRole({idRole}) {
  //const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [toggleIndex, setToggleIndex] = useState(null);

  const [ roleData, setRoleData ] = useState({
    id :"",
    nom :"",
    activer :"",
    createBy :"",
    createAt :"",
    updateAt :"",
    updateBy :"",
    accessEntrepriseDto : {},
    fonctionnalitesDto : []
  });

  // Récupération des informations du rôle
  useEffect(() => {
    if (idRole) {
        handleGetRoleById(idRole);
    }
  }, [idRole]);


  const handleGetRoleById = async (idRole) => {
    try {
        const resp = await getRoleById(idRole);
        setRoleData(resp.data);
    } catch (error) {
        console.error("Erreur lors de la récupération du rôle:", error);
        alert("Impossible de récupérer les informations du rôle.");
    }
};


      return(
            <>

             <Link onClick={handleShow} className="dropdown-item text-info" >Détails</Link>

             <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Informations d'un rôle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {roleData && (
                    <div>
                      <p><strong>ID :</strong> {roleData.id || 'N/A'}</p>
                      <p><strong>Nom :</strong> {roleData.nom || 'N/A'}</p>
                      <p><strong>Activé :</strong> {roleData.activer ? 'Oui' : 'Non'}</p>
                      <p><strong>Créé par :</strong> {roleData.createBy || 'N/A'}</p>
                      <p><strong>Créé le :</strong> {roleData.createAt || 'N/A'}</p>
                      <p><strong>Mis à jour par :</strong> {roleData.updateBy || 'N/A'}</p>
                      <p><strong>Mis à jour le :</strong> {roleData.updateAt || 'N/A'}</p>
                      <hr/>
                      {/* Affichage de accessEntrepriseDto */}
                      {roleData.accessEntrepriseDto && (
                        <div>
                          <p><strong>Accès Entreprise :</strong></p>
                          <p><strong>ID :</strong> {roleData.accessEntrepriseDto.id || 'N/A'}</p>
                          <p><strong>Propriétaire :</strong> {roleData.accessEntrepriseDto.proprietaire ? 'Oui' : 'Non'}</p>
                          <p><strong>Admin :</strong> {roleData.accessEntrepriseDto.admin ? 'Oui' : 'Non'}</p>
                          <p><strong>Gerant :</strong> {roleData.accessEntrepriseDto.gerant ? 'Oui' : 'Non'}</p>
                          <p><strong>Gestionnaire :</strong> {roleData.accessEntrepriseDto.gestionnaire ? 'Oui' : 'Non'}</p>
                          <p><strong>Caissier :</strong> {roleData.accessEntrepriseDto.caissier ? 'Oui' : 'Non'}</p>
                          <p><strong>Vendeur :</strong> {roleData.accessEntrepriseDto.vendeur ? 'Oui' : 'Non'}</p>
                          <p><strong>ECommerce :</strong> {roleData.accessEntrepriseDto.eCommerce ? 'Oui' : 'Non'}</p>
                        
                        </div>
                      )}
                       <hr/>
                      {/* Affichage des fonctionnalités */}
                      <p><strong>Fonctionnalités : </strong></p>
                      {roleData.fonctionnalitesDto && roleData.fonctionnalitesDto.length > 0 ? (
                        <ul style={{ paddingLeft: '20px' }}>
                          {roleData.fonctionnalitesDto.map((fonctionnalite, index) => (
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
                               <strong>{fonctionnalite.nom || 'Sans nom'}</strong>
                               <span>{toggleIndex === index ? '▲' : '▼'}</span>
                             </div>
       
                             {toggleIndex === index && (
                               <div style={{ marginTop: '0.5rem' }}>
                                  <li key={index} style={{ marginBottom: '10px' }}>
                                    <p><strong>Nom :</strong> {fonctionnalite.nom || 'N/A'}</p>
                                    <p><strong>Activée :</strong> {fonctionnalite.activer ? 'Oui' : 'Non'}</p>
                                    <p><strong>Créé par :</strong> {fonctionnalite.createBy || 'N/A'}</p>
                                    <p><strong>Créé le :</strong> {fonctionnalite.createAt || 'N/A'}</p>
                                    <p><strong>Mis à jour par :</strong> {fonctionnalite.updateBy || 'N/A'}</p>
                                    <p><strong>Mis à jour le :</strong> {fonctionnalite.updateAt || 'N/A'}</p>
                                  </li>
                                </div>
                             )}
                             </div>  
                          ))}
                        </ul>
                      ) : (
                        <p>Aucune fonctionnalité assignée</p>
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
export default DetailsRole;