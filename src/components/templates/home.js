import React, { useContext, useCallback,  useEffect } from 'react';
import {  useNavigate } from "react-router-dom";
import Header from './header';
import SideNav from './SideNav';
import Footer from './Footer';
import { AppContextAccessBackEnd, AppContextAccessEntreprise, AppContextEntreprise, AppContextFonctionnalite, AppContextToken, useAuth, useUsers } from '../../useContext/contextStateUser';
import { AppContext, AppContextParam, AppContextParamByType, AppContextSousParametre } from '../../useContext/context';

function Home() {
  const navigate = useNavigate();
  //j'utilise le token pour la redirection entre le page d'accueil et la page de connexion
 
  const { roles, stateToken} = useAuth(); // ✅ Récupère correctement le token depuis le contexte et ✅  la liste des roles
  const { stateParametreByType } = useContext(AppContextParamByType)
  const { stateT } = useContext(AppContext);
  const { stateSousParametre } = useContext(AppContextSousParametre);
  const { stateParametre } = useContext(AppContextParam);
  const { stateAccessBackEnd } = useContext(AppContextAccessBackEnd);
  const { stateAccessEntreprise } = useContext(AppContextAccessEntreprise);
  const { stateEntreprise } = useContext(AppContextEntreprise);
  const { stateFonctionnalite } = useContext(AppContextFonctionnalite);
  const { users } = useUsers();

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
  

  const dataStats = [
    { label: "Accès Backend", value: stateAccessBackEnd.length, icon: "fas fa-unlock-alt", color: "primary" },
    { label: "Accès Entreprise", value: stateAccessEntreprise.length, icon: "fas fa-user-lock", color: "success" },
    { label: "Fonctionnalités", value: stateFonctionnalite.length, icon: "fas fa-toolbox", color: "info" },
    { label: "Rôles", value: roles.length, icon: "fas fa-id-badge", color: "light" },
    { label: "Entreprises", value: stateEntreprise.length, icon: "fa-building", color: "secondary" },
    { label: "Utilisateurs", value: users.length, icon: "fa-users", color: "danger" },
    { label: "Types", value: stateT.length, icon: "fas fa-th-large", color: "dark" },
    { label: "Paramètres", value: stateParametre.length, icon: "fa-cogs", color: "warning" },
    { label: "Sous-paramètres", value: stateSousParametre.length, icon: "fa-layer-group", color: "muted" },
  ];


  return (
    <>
     <div id="main-wrapper">
    {/* {
        !stateToken || stateToken === "null" ? (
              < Connexion />
        ) :
        (
          <> */}
          <Header />
          <SideNav /> 
          <div className="content-body">
            {/* row */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-xl-12">
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="row">
                        <div className="col-xl-12">
                          <div className="card tryal-gradient">
                            <div className="card-body tryal row">
                              <div className="col-xl-7 col-sm-6">
                              <h2>Gérez efficacement vos ressources en un seul clic</h2>
                              <span>Notre plateforme vous aide à centraliser, suivre et optimiser vos données grâce à une interface intuitive et des outils intelligents.</span>

 {/* <a href="javascript:void(0);" className="btn btn-rounded  fs-18 font-w500">Try Free Now</a> */}
                              </div>
                              <div className="col-xl-5 col-sm-6">
                                <img src="images/chart.png" alt="img" className="sd-shape" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                        
                        {/*===============*/}

                          <div className="row">
                            {dataStats.map((item, index) => (
                              <div className="col-xl-3 col-md-6 mb-4" key={index}>
                                <div className={`card border-left-${item.color} shadow h-100 py-2`}>
                                  <div className="card-body d-flex justify-content-between align-items-center">
                                    <div>
                                      <div className={`text-${item.color} text-uppercase mb-1`}>{item.label}</div>
                                      <div className="h5 mb-0 font-weight-bold text-gray-800">{item.value}</div>
                                    </div>
                                    <div className="icon">
                                      <i className={`fas ${item.icon} fa-2x text-${item.color}`}></i>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                        {/*===============*/}

                       

                     
                        
                     
                 
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

export default Home;
