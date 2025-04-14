import React, { useCallback, useContext, useEffect } from 'react';
import { faCheckCircle, faCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router';
import Header from '../../templates/header';
import Footer from '../../templates/Footer';
import SideNav from '../../templates/SideNav';
import {  useAuth } from '../../../useContext/contextStateUser';
import { AppContextSousParametre } from '../../../useContext/context';
import EditSousParametre from './editSousParametre';
import DeleteSousParametre from './deleteSousParametre';
import AddSousParametre from './addSousParametre';
import { activerDesactiver, getAllSousParametres } from '../../../servicesApi/microservice-parametre';
import Preload from '../../templates/preload';
import DetailsSousParametre from './detailsSousParametre';

function ListSousParametre(){

  //j'utilise le token pour la redirection entre le page d'accueil et la page de connexion
   const {stateToken} = useAuth(); // ✅ Récupère correctement le token depuis le contexte

  const { stateSousParametre, setStateSousParametre } = useContext(AppContextSousParametre);
  
  const navigate = useNavigate();

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
      

    const handleActiverDesactiverSousParametre = (fonctionnalite) => {
        activerDesactiver(fonctionnalite).then((resp) =>{

        const newSousParametres = stateSousParametre.map((f) => {
            if(f.id === fonctionnalite.id){
                f.activer = !f.activer;
            }
            return f;
        });
          setStateSousParametre(newSousParametres);
        });
    };

    const columns = [
        {
            name: "Nom",
            selector: row => row.nom,
            sortable: true,
            //cell: (row) => <div style={{ fontWeight: "bold" }}>{row.nom}</div>,
        },
        {
          name: "description",
          selector: row =>  row.description,
          sortable: true
        },
        {
          name: "Date de Creation",
          selector: row =>  row.createAt,
          sortable: true
        },
        {
            name: "Activer/desactiver",
            cell: (row) => (
              <div>
                <button onClick={() => handleActiverDesactiverSousParametre(row)} className="btn btn-outline-primary">
                  <FontAwesomeIcon icon={row.activer ? faCheckCircle : faCircle}
                  />
                </button>
              </div>
            ),
            sortable: true,
          },
          {
              name:"Opérations",
              cell: row => (
                <div className="dropdown"><button className="btn btn-primary tp-btn-light sharp" type="button" data-bs-toggle="dropdown"><span className="fs--1"><svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="18px" height="18px" viewBox="0 0 24 24" version="1.1"><g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd"><rect x={0} y={0} width={24} height={24} /><circle fill="#000000" cx={5} cy={12} r={2} /><circle fill="#000000" cx={12} cy={12} r={2} /><circle fill="#000000" cx={19} cy={12} r={2} /></g></svg></span></button>
                    <div className="dropdown-menu dropdown-menu-end border py-0">
                        <div className="py-2">
                         < EditSousParametre id={row.id} />  
                    
                         < DeleteSousParametre id={row.id} />
                         < DetailsSousParametre id={row.id} />
                       </div>
                    </div>
                 </div> 
   
                ),
                sortable: true
                
          }
    ];

    function handleFilter(e) {
        const searchText = e.target.value.toLowerCase();
      
        if (searchText === "") {
            getAllSousParametres()
                .then( resp => {
                    setStateSousParametre(resp.data);
                })
                .catch((err) => {
                    console.log(err)
            });
        } else {
           const records = stateSousParametre.filter((row) => {
            return row.nom.toLowerCase().includes(searchText);
          });
          setStateSousParametre(records);
        }
      }


   return(
    <>
      <Preload/>
        <div id="main-wrapper">
            <Header/>
            <SideNav />
            <div className="content-body">
              <div className="container-fluid">
                <div className="project-page d-flex justify-content-between align-items-center flex-wrap">
                  <div className="project mb-4">
                    <ul className="nav nav-tabs" role="tablist">
                    
                    </ul>
                  </div>
                  <div className="mb-4">
                      < AddSousParametre /> 
                  </div>
            
                </div>	
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tab-content">
                      <div className="tab-pane fade active show" id="AllStatus">
                        
                        <div className="row">
                          <div className="col-12">
                            <div className="card">
                              <div className="card-header">
                                {/* <h4 className="card-title">Liste des sous parametre</h4> */}
                                <ol className="breadcrumb">
                                      <li className="breadcrumb-item active"><a href="#">Géstion des sous paramètres</a></li>
                                  </ol>
                              </div>
                              <div className="card-body">
                            <div >
                            <div>
  
                                <div className='text-end'><input type='text' onChange={ handleFilter }/></div>
                                <br/>
                              <DataTable 
                                    columns={columns} 
                                    data={stateSousParametre} 
                                    fixedHeader
                                    pagination 
                                    striped
                                    />
                            </div>
              
                            </div>
                          </div>
                        </div>                                                
                      </div>
                    </div>
                  </div>
                </div>	
              </div>
            </div>
  
              </div>
            </div> 
            <Footer /> 
          </div>
    </>

    );
}
export default ListSousParametre;