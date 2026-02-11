import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import {storage, firestore} from "../../firebase/firebase"
import"./main.css"
import { useContext } from 'react';
import { DataBaseDataContext } from '../../contexts/DataBaseDataContext';
import fallbackImage from "../../img/KTPLogo.jpeg";
import axios from 'axios';

const backendUrl = import.meta.env.VITE_LOCAL_BACKEND_URL; //change back to VITE_BACKEND_URL for production 
async function getUserByEmail(email:String){
await axios.get(`${backendUrl}/users/email/${email}`)
.then(res =>{
    return res.data
})
.catch(err =>{
    //console.log("Query filter error: ", err)
    return err
})
}


async function getUserByName(name:String){
    let func = async (name:String) => await axios.get(`${backendUrl}/users/name/${name}`)
    .then(res =>{
        //console.log(res.data)
        return res.data
    })
    .catch(err =>{
        //console.log(err)
        return err
    })

    let splittedName = name.split(" ")
    if (splittedName.length < 2){
        let wrd1 = splittedName[0]
        let wrd2 = splittedName[0]

        let res = await func(wrd1)
        if(res.length > 0){

            return res
        }else{
            let res = await func(wrd2)
            if(res.length > 0){

                return res
            }else{
                return []
            }
        }

    }else{
        return await func(name)

    }
}

export default function AdminDashboard(){
    interface User {
  WebsitePhotoURL: string;
  id: string;
  Position?: number;
  Eboard_Position?: string;    // E-Board position (if any)
  websitePic?: string;         // ID linking to a Picture document
  LinkedIn?: string;           // LinkedIn URL or username
  FirstName?: string;
  LastName?: string;
  Class?: string;
  pictureUrl?: string | null;  // Field we add to hold the final image URL or fallback
}

interface DataBaseDataContextType {
  userData?: User[];
}
    const [sideMenuToggled, toggleSideMenu] = useState(false) 
      const dataContext = useContext(DataBaseDataContext) as DataBaseDataContextType | null;
      const userData = dataContext?.userData;

    const SideMenu = (
            <div 
            className = "p-8"
            style= {{
                position:"fixed",

                backgroundColor: "white",
                transitionDuration: "0.25s",
                top: 0,
                left: sideMenuToggled ? 0 : "-220px",
                

                width: "200px", 

                zIndex: 1000}}>
                <MenuIcon onClick = {() => toggleSideMenu(!sideMenuToggled)} style= {{cursor: "pointer", float: "right"}} />

                <ul style = {{
                    display: "flex",
                    flexDirection: "column",
                    rowGap: "20px",
                    listStyleType: "none",
                    padding: 0,
                    marginTop: 50
                }}>
                    <li><p>Home</p></li>
                    <li><p>Directory</p></li>

                    <li className = "logout">
                        <p>Logout</p>
                    </li>
                </ul>


                
            </div>
        )
    const filters = ["Eboard Position", "Class Year", "Position"]
    const [brotherEntryUnderMouseHover,set_brotherEntryUnderMouseHover] = useState( -1); 
    const [queryResults, setQueryResults] = useState([] as User[]);
    const [searchQuery, setSearchQuery] = useState("");
    const allBrothers = (data : User[]) =>  {
        
        return (
                            <div className = "brothersListContainer" style = {{display: "flex", flexDirection: "column", 
                    alignItems:"center", justifyContent:"center", 
                    width: "max-content",
                        transitionDuration:"0.25s",
                        rowGap: 10
                    }}>
                    {

                        data?.map((user, idx)=> 

                            <div 
                            onMouseEnter = {() => set_brotherEntryUnderMouseHover(idx)}
                            className = "brotherEntry"
                            style = {{

                                backgroundColor: idx == brotherEntryUnderMouseHover ? "lightgray" : "transparent",
                                cursor: "pointer",

                                textAlign: "center", 
                                display:"flex", 
                                flexDirection: "row", 
                                width: "50rem", 
                                justifyContent:"space-between",
                                height: 75, 
                                
                                 paddingLeft: sideMenuToggled ? 200 : 0,
                                 transitionDuration: "0.25s",
                                 


                                }}>


                                    
                                <img src = {user.WebsitePhotoURL ?? fallbackImage} height = {50} style = {{aspectRatio:"initial"}} />
                                <p style = {{textAlign:"center", width:"inherit"}}>{user.FirstName} {user.LastName}</p>

                            </div>
                            )
                        
                    }
                        </div>

    )
}

function handleInputSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(searchQuery.includes("@")){
        getUserByEmail(searchQuery)
        .then(res =>{
        //setQueryResults(res) 
         console.log(res)
   
        })
        .catch(err =>{
            setQueryResults([])
            console.log("Error fetching user by email: ", err)
            
        })
    }else{
        getUserByName(searchQuery)
        .then(res =>{
                setQueryResults(res)
                
                console.log(res)
        })
        .catch(err =>{
            setQueryResults([])
            console.log("Error fetching user by name: ", err)
        })
    }
}   
 
     
    return(
        <div className="p-8 max-w-6xl mx-auto"  id = "SideMenuContainer">

                
                <MenuIcon onMouseEnter = {() => toggleSideMenu(!sideMenuToggled) } style= {{cursor: "pointer"}} />

                  <main style = {{
                    display:"flex",
                    paddingTop: 50, 
                    columnGap: 16,
                     flexDirection:"row", alignItems:"flex-start", justifyContent:"center", maxWidth: "100vw", backgroundColor:"transparent", rowGap: 50}}>
                        
                       {SideMenu}

                        {queryResults.length > 0 ? allBrothers(queryResults) : allBrothers(userData ?? [])}   


           
                        <div className = "search_and_filter"
                        style = {{
                            display: "flex",
                            flexDirection: "column",
                            columnGap: 20,
                            alignItems:"flex-start",
                            justifyContent:"top",
                            position:"relative",
                            height:"max-content",
                            width:"transparent",
                            backgroundColor: 'transparent',
                            right: 0,
                        

                        }}>
                        <form onSubmit={handleInputSubmit}>
                        <input placeholder='search' onChange = {(e) =>{
                            setSearchQuery(e.target.value)
                            }} />
                            </form>

                        <div className = "filters" style = {{height:"auto", marginTop: 24}}>
                            {
                                filters.map(itm => <h1>{itm}</h1>)
                            }
                        </div>
                    </div>
                 
                </main>
                


        </div>
    )
}