import React, { useCallback,  useEffect, useState } from "react"; 
import {  useNavigate } from "react-router-dom";
import DeleteUser from "./deleteUser";
import EditerUser from "./editerUser";
import AddUser from "./addUser.js";
import Preload from "../../templates/preload.js";
import {  useAuth, useUsers } from "../../../useContext/contextStateUser.js";
import Header from "../../templates/header.js";
import Footer from "../../templates/Footer.js";
import SideNav from "../../templates/SideNav.js";
import { updateEtatActiver } from "../../../servicesApi/microservice-utilisateur.js";
import DetailUser from "./detailUser.js";

function ListUser(){
   const navigate = useNavigate();
   //state pour activer les tables selon les roles
   // l’onglet actif par défaut soit le premier rôle de
   const [activeTab, setActiveTab] = useState("ADMIN");

   //j'utilise le token pour la redirection entre le page d'accueil et la page de connexion
    const {stateToken} = useAuth(); // ✅ Récupère correctement le token depuis le contexte
   const { users, setUsers } = useUsers(); // ✅ Récupérer la liste des utilisateurs
   
   // États pour la pagination et la recherche
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersPerPage] = useState(10); // Nombre d'utilisateurs par page

  // <gerer la redirection vers la page de connexion si le token n'existe pas>
  const handlerRedirection = useCallback(() => {
      if(!stateToken || stateToken === null){
          navigate('/');
      }
  }, [stateToken, navigate]);
 
  useEffect(() => {
      handlerRedirection();
  }, [handlerRedirection]);
// </gerer la redirection vers la page de connexion si le token n'existe pas>

  useEffect(() => {
    //console.log("Liste des utilisateurs:", users); // Affiche la liste dans la console
  }, [users]); // Ré-exécute le useEffect si la liste change

  // Réinitialiser la page quand le terme de recherche change
  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm]);

  const accesMap = {
    PERSONNEL: "personnel", 
    ADMIN: "admin",
    ACCOMPAGNATEUR: "accompagnateur",
    INGENIEUR: "ingenieur",
    ASSISTANT: "assistant",
    EDITEUR: "editeurCatalogue",
    SUPERADMIN: "superAdmin",
    SANSPROFIL: "sansprofil"
  };

 const renderTabContent = (acces) => {
    // Filtrer les utilisateurs selon le profil et la recherche
    const filteredUsers = users.filter(u => {
      if (acces === "SANSPROFIL") {
        // Cas spécial pour les utilisateurs sans accessBackEndDto
        const hasNoAccess = !u.accessBackEndDto || Object.keys(u.accessBackEndDto).length === 0;
        const matchesSearch = searchTerm === '' ||
          u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase());
        return hasNoAccess && matchesSearch;
      } else {
        // Cas normal avec accessBackEndDto existant
        const profilKey = accesMap[acces]; // on récupère la clé associée au rôle
        const matchesProfile = u.accessBackEndDto?.[profilKey] === true;
        const matchesSearch = searchTerm === '' || 
            u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesProfile && matchesSearch;
      }
    });

    // Calcul des utilisateurs à afficher pour la pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Fonction pour changer de page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
      <>
        {/* Barre de recherche */}
        <div className="mb-3">
            <input
                type="text"
                className="form-control"
                placeholder="Rechercher par nom, prénom, matricule ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <table className="table table-bordered table-striped table-condensed">
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Matricule</th>
              <th>Email</th>
              <th>Date de création</th>
              <th>Profil</th>
              <th>Contrat</th>
              <th>Pièce jointe</th>
              <th>Opérations</th>
              <th>État</th>
              <th>Activer/Désactiver</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => ( 
                <tr key={`${user.id}-${index}`}>
                  <td>{user.prenom}</td>
                  <td>{user.nom}</td>
                  <td>{user.matricule}</td>
                  <td>{user.email}</td>
                  <td>{user.createAt}</td>
                  <td>{acces}</td>
                  <td>{user.contrat}</td>
                  <td>{user.pieceJointe}</td>
                  <td>
                      <EditerUser userId={user.id} />    
                      <DeleteUser userId={user.id} /> 
                      <DetailUser userId={user.id} /> 
                  </td>
                  <td>{user.activer ? "Activer" : "Désactiver"}</td>
                  <td> 
                    {user.activer ? 
                      (
                        <button onClick={() => handleActiveUser(user)} className="btn btn-sm btn-success">
                          Désactiver
                        </button>
                      ) :
                      (
                        <button onClick={() => handleActiveUser(user)} className="btn btn-sm btn-danger">
                          Activer
                        </button>
                      )
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center">
                  {searchTerm ? "Aucun utilisateur trouvé pour cette recherche." : "Aucun utilisateur disponible pour ce profil."}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Affichage des utilisateurs {indexOfFirstUser + 1} à {Math.min(indexOfLastUser, filteredUsers.length)} sur {filteredUsers.length}
            </div>
            
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    className="page-link"
                    disabled={currentPage === 1}
                  >
                    &laquo; Précédent
                  </button>
                </li>

                {[...Array(totalPages).keys()].map(number => (
                  <li 
                    key={number + 1} 
                    className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                  >
                    <button 
                      onClick={() => paginate(number + 1)} 
                      className="page-link"
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    onClick={() => paginate(currentPage + 1)} 
                    className="page-link"
                    disabled={currentPage === totalPages}
                  >
                    Suivant &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </>
    );
  };


  const handleActiveUser = (user) => {
    updateEtatActiver(user).then((resp)=>{
        const newUsers = users.map((u)=>{
            if(u.id === user.id){
                u.activer = !u.activer
            }
            return u;
        });
        setUsers(newUsers)
    })
};

    return(
        <>
         <Preload/>
         <div id="main-wrapper">
         
                <Header />
                <SideNav /> 
                <div className="content-body">
                <div className="container text-center">
                  <div  className="ms-4 mb-3">
                      < AddUser />
                      <button className="btn btn-secondary btn-rounded fs-18">+Ajouter un personnel</button>
                  </div>
                  </div>
                  <div className="card-body">
                    <div className="container text-center">
                      <ul className="nav nav-tabs">
                        {Object.keys(accesMap).map((roleKey) => ( 
                          <li className="nav-item" key={roleKey}>
                            <button
                              className={`nav-link ${activeTab === roleKey ? "active" : ""}`}
                              onClick={() => setActiveTab(roleKey)}
                              style={{ cursor: "pointer" }}
                              role="tab"
                              aria-selected={activeTab === roleKey}
                            >
                              {roleKey}
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div className="tab-content mt-3">
                        <div className="tab-pane fade show active" role="tabpanel">
                          {renderTabContent(activeTab)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Footer/>
           
          </div>
        </>
    )
}


export default ListUser;