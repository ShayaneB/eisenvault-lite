import React, {useEffect,useState,Fragment} from 'react'
import Modal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf,faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import Action from '../Action/Action';
import Avatar from "react-avatar";
import './MyUploads.scss';
import Search from "../SearchBar/SearchBar";
import axios from 'axios';
// import { getToken } from '../../Utils/Common';
function MyUploads(){
  const[FileState,setFileState]=useState([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);

useEffect(()=>{
  axios.get('https://systest.eisenvault.net/alfresco/api/-default-/public/alfresco/versions/1/nodes/207c3132-0cfd-483e-9cca-36bafea26725/children?skipCount=0&maxItems=100', 
   {headers:{Authorization: "Basic " + btoa("TICKET_f704a0c65478261285b9c1d3d5b3758cef9f4919")
  }
   
  
  }
  ).then((response) => {
  console.log(response.data)
  
  setFileState(response.data.list.entries)

});
},[]);
// let FileState=[
// {id:1 ,Item_Name:"Sample1.pdf",Uploaded_On:"2 Days Ago"},
// {id:2 ,Item_Name:"Sample2.pdf",Uploaded_On:"12 Days Ago"},
// {id:3 ,Item_Name:"Sample3.pdf",Uploaded_On:"20 Days Ago"}
// ];

// setFileState(
//   FileState.map(d=>{
//     return{
//     select:false,
//     id:d.id,
//     Item_Name:d.Item_Name,
//     Uploaded_On:d.Uploaded_On
//         };
//       }));
    // },[]);

    return( 
      <Fragment>

          <div id="second_section">
            <h2>My Uploads</h2>
            <Search />

            <Avatar className='avtarStyle'
                color='#E07050' size='3rem'
                round 
                name="Shayane Basu" /> 
                
              <div className="filesUpload">
                <table id="doc_list">
                  <tbody>
                  <tr id="icons">
                    <th id="icon01">
                      <input type="checkbox" onChange={(e)=>{
                        let checked=e.target.checked;
                        setFileState(FileState.map((d)=>{
                          d.select=checked;
                          return d;
                        }));
                      }}/>
                    </th>
                    <th id="item-name">Item Name</th>
                    <th id="shared">Uploaded On</th>
                  
        <th id="action"><Action/></th>
        <Modal
            className="Modal"
            isOpen={modalIsOpen}
            shouldCloseOnOverlayClick={false}
            onRequestClose={() => setmodalIsOpen(false)}
            style={{
              overlay: {
                backgroundColor:"rgba(0, 0, 0, 0.6)"
              }
            }}
          >
            <h2 className="Dh2">Delete Documents</h2>
            <p className="content Dh3">
              Are you sure you want to delete selected files?
              <br />
              <br /> NOTE:The deleted file will be stored in trash for 30 days.
            </p>

            <button
              className="btn-cancel btn-c"
              onClick={() => setmodalIsOpen(false)}
            >
              CANCEL
            </button>
            <button className="btn-continue btn-d">DELETE</button>
          </Modal>
                </tr>
                  
                  { FileState.map((d,i) => (
                    <tr  key={d.entry.id} id="first_details">
                    <td className="file_icon1">
                      <input onChange={(event)=>{
                          let checked=event.target.checked;
                        setFileState(FileState.map((data)=>{
                          if(d.entry.id===data.entry.id){
                            data.select=checked;
                          }return data;
                        }));
                      }} type="checkbox" checked={d.select} />
                      </td>
                    <td className="file_name-u">
                    
                    <FontAwesomeIcon className="pdf-file fas fa-file-pdf" icon={faFilePdf}/> {d.entry.name}</td>
                    <td className="details-u">{d.entry.createdAt}</td>
                    <td className="delete-u">
                    <FontAwesomeIcon className="fas fa-times-circle" icon={faTimesCircle} 
                      onClick={() => setmodalIsOpen(true)} />
                  </td>
                  </tr>
                  ) )}
                </tbody>
              </table>
              </div>
              </div>
    </Fragment>

          )
          }

export default MyUploads;