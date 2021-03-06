import React, { Fragment,useEffect,useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faUndo,faFile,faFolder} from "@fortawesome/free-solid-svg-icons";
import Axios from 'axios';
import Pagination from '../Pagination/Pagination';
import { useHistory } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import LoadingIndicator from '../../Utils/LoadingIndicator';
import Search from '../SearchBar/SearchBar';
import alertify from 'alertifyjs';
import './TrashDisplay.scss';
import '../../Containers/styles.scss';
import { getToken,getUrl } from '../../Utils/Common';
import ProfilePic from "../Avtar/Avtar";
import NestedToolTip from "../UI/popup";

function TrashDisplayFiles(props){
  let history = useHistory();
  const[TrashFileState,setTrashFileState]=useState([]);
  const [lastButtonClicked, setLastButtonClicked] = useState("");
  const [ currentPage, setCurrentPage ] = useState(1);
  const [postsPerPage] = useState(10);
  const [ paginationDefualt, setPaginationDefault ] = useState([]);
  const [hasMoreItems , setMoreItems] = useState('');
  const [skipCount , setSkipCount ] = useState('');
  const [count,setCount]=useState('');
  const [totalitems,settotalitems]=useState('')

  //API CALL
  useEffect(()=>{
    getDeletedData();
  },[]);

const getDeletedData=()=>{  //content of trash page
  trackPromise(
  Axios.get(getUrl()+'alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes?skipCount=0&maxItems=50',
    {headers:{
    Authorization: `Basic ${btoa(getToken())}`
     }}).then((response) => {
      let FileData=response.data;
      setPaginationDefault(response.data.list.pagination)
      settotalitems(response.data.list.pagination.totalItems)
      setSkipCount(response.data.list.pagination.skipCount+10)
      setTrashFileState(response.data.list.entries.map(d=>{
        return {
          select:false,
          id:d.entry.id,
          name:d.entry.name,
          createdOn:d.entry.createdAt.split('T')[0],
          archivedAt:d.entry.archivedAt.split('T')[0],
          type:d.entry.isFile
        }})) 
      }).catch(err=>alert(err))
  )
};
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = TrashFileState.slice(indexOfFirstPost, indexOfLastPost);

  const permanentDeleteByIds=(close)=>{    //function to delete selected files permanently
    TrashFileState.forEach(d=>{
      if(d.select){
      Axios.delete(getUrl()+`alfresco/s/api/archive/archive/SpacesStore/${d.id}`, 
      {headers:{
      Authorization: `Basic ${btoa(getToken())}`
      }
    }).then((response)=>{
          close();
          alertify.alert('Document Deleted Successfully').setting({
            'message': 'Document Deleted Successfully',
            'onok': () => {alertify.alert().destroy();} 
          });
          getDeletedData();
        }).catch(err=>alert(err));
      };
      })}

    const DefaultDelete=(close)=>{  //function to delete all the files permanently 
       Axios.delete(getUrl()+`alfresco/s/api/archive/workspace/SpacesStore`, 
        {headers:{
        Authorization: `Basic ${btoa(getToken())}`
         }
       }).then((response)=>{
            close();
            alertify.alert('Document Deleted Successfully').setting({
              'message': 'Document Deleted Successfully',
              'onok': () => {alertify.alert().destroy();} 
            });
            getDeletedData();
           }).catch(err=>alert(err));
         };
        
     const DefaultRestore=(close)=>{ //function to restore all the files
      TrashFileState.forEach( d=>{
        if(d.id){
           Axios.put(getUrl()+`/alfresco/s/api/archive/archive/SpacesStore/${d.id}`, {},
            {headers:
            {
              Authorization: `Basic ${btoa( getToken() )}`
            }
        }).then((response)=>{
              close();
              alertify.alert('Document Restored Successfully').setting({
                'message': 'Document Restored Successfully',
                'onok': () => {alertify.alert().destroy();} 
              });
              getDeletedData();
              }).catch(err=>alert(err));
          };
          })
      }

    const RestoreFileByIds=(close)=>{  //function to restore selected files 
      TrashFileState.forEach( d=>{
        if(d.select){
          Axios.put(getUrl()+`alfresco/s/api/archive/archive/SpacesStore/${d.id}`, {},
            {headers:
            {
              Authorization: `Basic ${btoa( getToken() )}`
            }
        }).then((response)=>{
              close();
              alertify.alert('Document Restored Successfully').setting({
                'message': 'Document Restored Successfully',
                'onok': () => {alertify.alert().destroy();} 
              });
              getDeletedData();
              }).catch(err=>alert(err));
          };
          })}

     const handleDelete=(id)=>{    //function to delete files by clicking on trash icon
      Axios.delete(getUrl()+`alfresco/s/api/archive/archive/SpacesStore/${id}`, 
      {headers:{
      Authorization: `Basic ${btoa(getToken())}`
       }
     }).then((data)=>{
          alertify.confirm().destroy(); 
          alertify.alert('Document Deleted Successfully').setting({
            'message': 'Document Deleted Successfully',
            'onok': () => {alertify.alert().destroy();} 
          });
          getDeletedData();
           }).catch(err=>alert(err));}
     
     const handleRestore=(id)=>{ //function to restore files by clicking on restore icon
        Axios.put(getUrl()+`alfresco/s/api/archive/archive/SpacesStore/${id}`, {},
        {headers:{
      Authorization: `Basic ${btoa(getToken())}`
       }
     }).then((data)=>{
          alertify.confirm().destroy(); 
          alertify.alert('Document Restored Successfully').setting({
            'message': 'Document Restored Successfully',
            'onok': () => {alertify.alert().destroy();} 
          });
          getDeletedData();
           }).catch(err=>alert(err));}
     
     
      function next(){  //function for pagination's next button
      var localSkipCount = skipCount;
      if (lastButtonClicked === "previous")
         {
          if(totalitems>20){
           if(localSkipCount===0)
             {
               localSkipCount=localSkipCount + 10 
             }else{
              localSkipCount = localSkipCount + 20;}
          }
       else{
          localSkipCount=localSkipCount + 0 ;
        }}
       document.getElementById("myprevBtn").disabled = false;
         Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes?skipCount=${localSkipCount}&maxItems=10`,
         {headers:{
           Authorization: `Basic ${btoa(getToken())}`
         }}).then((response) => {
          setTrashFileState(response.data.list.entries.map(d=>{
            return {
              select:false,
              id:d.entry.id,
              name:d.entry.name,
              createdOn:d.entry.createdAt.split('T')[0],
              archivedAt:d.entry.archivedAt.split('T')[0]
            }})) 
            setCount(response.data.list.pagination.count)
              setSkipCount(response.data.list.pagination.skipCount+10)
              if(response.data.list.entries.length===0){
                document.getElementById("myBtn").disabled = true;  
              }
              setLastButtonClicked("next");
        });
        }
      
      function previous(){ //function for pagination's previous button
        var localSkipCount = skipCount;
        if (lastButtonClicked === "next") {
          if(localSkipCount===10){
              
              localSkipCount = localSkipCount - 10;
          }
          else{
         localSkipCount = localSkipCount - 20;}
      }
        document.getElementById("myBtn").disabled = false;  
        Axios.get(getUrl()+`alfresco/api/-default-/public/alfresco/versions/1/deleted-nodes?skipCount=${localSkipCount}&maxItems=10`,
        {headers:{
          Authorization: `Basic ${btoa(getToken())}`
        }}).then((response) => {
          setTrashFileState(response.data.list.entries.map(d=>{
            return {
              select:false,
              id:d.entry.id,
              name:d.entry.name,
              createdOn:d.entry.createdAt.split('T')[0],
              archivedAt:d.entry.archivedAt.split('T')[0]
            }})) 
            setCount(response.data.list.pagination.count)
            if (response.data.list.pagination.skipCount >0){
              setSkipCount(response.data.list.pagination.skipCount - 10)
              document.getElementById("myprevBtn").disabled = false;
            }else{
              document.getElementById("myprevBtn").disabled = true;
            }
            setLastButtonClicked("previous")
           });
       }
        
       function handleDocument(file,id,title){
        file ? history.push(`/document-details/${id}/${title}`) : history.push(`/document/${id}`)
      }
      
  return(
    <Fragment>
        <div id="second_section">
        <div className="title">
          <h2>Trash</h2>
          <ProfilePic />
        </div>

        <div className="search-profile">
          <Search />
        </div>

        <div className="filesUpload">
        <table id="doc_list">
          <tbody>
            <tr id="icons">
                <th id="icon01">
                  <input type="checkbox"
                  onChange={(e)=>{
                    let checked=e.target.checked;
                    setTrashFileState(TrashFileState.map((d)=>{
                      d.select=checked;
                      return d;
                    }));
                  }}/></th>
                <th id="item_name">Item Name</th>
                <th id="created">Created on</th> 
                <th id="deleted">Deleted on</th>
                 <th id="action-trash">

                  <NestedToolTip restored={RestoreFileByIds} defrestore={DefaultRestore}
                  defdelete={DefaultDelete} deleted={permanentDeleteByIds}/>
                  </th>  
                </tr>
                
                {currentPosts.map((d,i) => (
                 <tr  key={d.id} id="first_details">
                 <td className="file_icon1">
                   <input onChange={(event)=>{
                      let checked=event.target.checked;
                    setTrashFileState(TrashFileState.map((data)=>{
                      if(d.id===data.id){
                        data.select=checked;
                      }return data;
                    }));
                   }} type="checkbox" checked={d.select}
                    /> </td> 
                 <td className="file_name-u"
                 onClick={() => handleDocument(d.type,
                  d.id,
                  d.name) }>
                 <FontAwesomeIcon className="pdf-file fas fa-file-pdf" 
                     icon={d.type ? faFile : faFolder}/> 
                    {d.name}</td>         
                 <td className="created_t">{d.createdOn}</td>                     
                <td className="deleted_t">{d.archivedAt}</td> 
                <td className="delete-icon">
                <FontAwesomeIcon icon={faTrash} className="TrashIcon" 
                onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                buttonFocus : "ok",
                'message' : 'DO YOU WANT TO DELETE THIS FILE '+ d.name,'onok': () => {handleDelete(d.id)} ,
                'oncancel': () => {alertify.confirm().destroy();}}).show() }}/>
                <FontAwesomeIcon icon={faUndo} className="UndoIcon" 
                 onClick={()=>{ alertify.confirm().setting({transition:'pulse',
                 buttonFocus : "ok",
                 'message' : 'DO YOU WANT TO RESTORE THIS FILE '+ d.name,'onok': () => {handleRestore(d.id)} ,
                 'oncancel': () => {alertify.confirm().destroy();}}).show()}}/>
                 </td></tr>
                ))}
        </tbody>
      </table>
      <LoadingIndicator/>
    </div>
  </div>

  <div className="col-md-6">
      <Pagination
             handlePrev={previous}
             handleNext={next}
        />
    </div>
</Fragment>
)
}
  export default TrashDisplayFiles;