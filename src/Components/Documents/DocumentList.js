import React,{Fragment , useEffect , useState} from 'react';
import axios from 'axios';
import { useHistory} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobeAsia, faFile, faHdd } from "@fortawesome/free-solid-svg-icons";
import './DocumentList.scss';

import {getToken} from  "../../Utils/Common";
import ProfilePic from "../Avtar/Avtar";

import Search from "../SearchBar/SearchBar";
import IconBar from "../IconBar/IconBar";

import Modal from "../Modal/Modal";
import { CreateDepartment ,RenameDepartment , DeleteDepartment} from "../Modal/DeleteModalSumm/DeleteSumm";
import Pagination from '../Pagination/Pagination';


const DocumentsList = () => {
  const [createmodalIsOpen, createsetmodalIsOpen] = useState(false);
  const [editmodalIsOpen, editsetmodalIsOpen] = useState(false);
  const [deletemodalIsOpen, deletesetmodalIsOpen] = useState(false);

  let history = useHistory();
  const [ departments , setDepartments ] = useState([]);
  const [ documents , setDocuments ] = useState([]);
  
  const [ currentPage, setCurrentPage ] = useState(1);
  const [postsPerPage] = useState(10);

  const departmentTitle = useFormInput ('');

  useEffect(() => {
    axios.get('https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/sites?skipCount=0&maxItems=100',
      {
        headers:
        {
          Authorization: `Basic ${btoa(getToken())}`
        }
        }).then((response) => {
      console.log(response.data)
      setDepartments(response.data.list.entries)
    });
  },[]);

// Get current posts
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = departments.slice(indexOfFirstPost, indexOfLastPost);

// Change page
const paginate = (pageNumber) => setCurrentPage(pageNumber);

function handleDocumentLibrary(key){
  axios.get(`https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/nodes/${key}/children?skipCount=0&maxItems=100`,
        {
          headers:
          {
            Authorization: `Basic ${btoa(getToken())}`
          }
          }).then((response) => {
        console.log(response.data)
        setDocuments(response.data.list.entries)
        documents.map(d => (
          d.entry.name === 'documentLibrary' ?  history.push(`/document/${d.entry.id}`)
          : null
        ) 
          )
      }).catch((error) => {
        console.log(error);
      }
      );     
}

function handleCreateDepartment(){
  axios.post('https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/sites',{
   title: departmentTitle.value , visibility: "PUBLIC"
  },
  {
    headers:
          {
            Authorization: `Basic ${btoa(getToken())}`
          }
  }).then(response => {
    alert("Department successfully created");
    console.log(response)
  }).catch(error => {
    if (error.response.status===409){
      alert("Department with this name already exists");
    }
    console.log(error)
});
createsetmodalIsOpen(false)
}
return (
  <Fragment>
          <Modal show={createmodalIsOpen}>
           <CreateDepartment createDept={handleCreateDepartment} clicked={() => createsetmodalIsOpen(false)} departmentTitle={departmentTitle}/>
          </Modal>
          <Modal show={deletemodalIsOpen}>
            <DeleteDepartment clicked={() => deletesetmodalIsOpen(false)}></DeleteDepartment>
          </Modal>
          <Modal show={editmodalIsOpen}>
            <RenameDepartment clicked={() => editsetmodalIsOpen(false)}></RenameDepartment>
          </Modal>

      <div id="second_section">
      <h2>Document List</h2>
        <Search />
        <ProfilePic />

            <div>

              <IconBar 
              // toggleedit = {() =>{editsetmodalIsOpen(true)}}
                toggleadd = {() =>{createsetmodalIsOpen(true)}}
                toggledelete = {() =>{deletesetmodalIsOpen(true)}}
              />
            </div>

      <ul className='files'>
          
           <table id="doc_list">
          {currentPosts.map(department => (
              <tbody key={department.entry.id}>
                  <tr className='details'>
                  <td className='fileicon'>
                  
                    <FontAwesomeIcon icon={faGlobeAsia} className="fas"/>
                    {department.entry.title}</td>

                    
                     <td className='fileDetails' onClick={() => handleDocumentLibrary(department.entry.guid)}>
                    Document Library
                    {document.folders} </td>

                    {/* <td className='fileDetails'> 
                    <FontAwesomeIcon icon={faFile} className="fas"/>
                    {document.files} </td>

                    <td className='fileDetails'> 
                    <FontAwesomeIcon icon={faHdd} className="fas"/>
                    {document.size} </td> */}

                   </tr>
                </tbody>
          ))}
          </table> 
      </ul>

      </div>

      <div className="col-md-6">
      <Pagination
       postsPerPage={postsPerPage}
       totalPosts={departments.length}
       paginate={paginate}
        />
        </div>

  </Fragment>
      )
    }

    const useFormInput = initialValue => {
      const [value, setValue] = useState(initialValue);
     
      const handleChange = e => {
        setValue(e.target.value);
      }
      return {
        value,
        onChange: handleChange
      }
    }

export default DocumentsList;