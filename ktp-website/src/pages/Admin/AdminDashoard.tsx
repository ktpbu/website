import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import {storage, firestore} from "../../firebase/firebase"
import { useContext } from 'react';
import { DataBaseDataContext } from '../../contexts/DataBaseDataContext';
import fallbackImage from "../../img/KTPLogo.jpeg";
import axios from 'axios';
import ViewANdEditMember from './BatchAddMembers';
import Modal from 'react-modal';
import "./main.css"

import SideMenu from '../../components/Admin/SideMenu';

const backendUrl = import.meta.env.VITE_LOCAL_BACKEND_URL; //change back to VITE_BACKEND_URL for production


export default function AdminDashboard(){

    const [sideMenuToggled, toggleSideMenu] = useState(false)
      const dataContext = useContext(DataBaseDataContext) as DataBaseDataContextType | null;
      const userData = dataContext?.userData;


interface User {
  WebsitePhotoURL: string;
  id: string;
  Position?: number;
  Eboard_Position?: string;
  websitePic?: string;
  LinkedIn?: string;
  FirstName?: string;
  LastName?: string;
  Class?: string;
  pictureUrl?: string | null;
  Clout?: string;
  BUEmail?: string;
  Major?: string;
  Minor?: string;
  GradYear?: string;
  Colleges?: string;
}

interface DataBaseDataContextType {
  userData?: User[];
}

async function getUserByEmail(email:String){
    const res = await axios.get(`${backendUrl}/users/email/${email}`)
    console.log(res.data)
    return res.data
}



function getUserByName(name: string): User[] {
    const lowerName = name.toLowerCase();
    const splittedName = name.split(" ")


    if (splittedName.length > 1){
        let firstName = splittedName[0].toLowerCase()
        let lastName = splittedName[1].toLowerCase()

        return (userData ?? []).filter(user =>
        user.FirstName?.toLowerCase().includes(firstName)
        &&
        user.LastName?.toLowerCase().includes(lastName)
    );
    }

    return (userData ?? []).filter(user =>
     user.FirstName?.toLowerCase().includes(lowerName)
        ||
        user.LastName?.toLowerCase().includes(lowerName)
    );

}

    const filters = ["Position", "Grad Year", "Committee", "Class"] //must match that of the filterValues in index values 
    const filterValues = [
        ["Member", "Pledge", "Rushee", "President", "Vice President"], //Position
       [2026, 2027, 2028, 2029],//Grad Year
        ["Philantropy", "Tech Dev"], //COmmittee
        ["Zeta", "Alpha"] //Class
    ]
    const [selectedFilters, setSelectedFilters] = useState({
        "Position": false as any,
        "Grad Year": false as any,
        "Committee": false as any,
        "Class": false as any,
    })


    const getRangeOfGradYear = () =>{
        let currentYear = new Date().getFullYear() 
        let idx = 4;
    }

    getRangeOfGradYear() 



    const [queryResults, setQueryResults] = useState([] as User[]);
    const [searchQuery, setSearchQuery] = useState("");



    const allBrothers = (data : User[]) =>  {

        return (
                            <div className="flex flex-col items-center justify-center w-full md:w-max transition-all duration-300 gap-y-2.5">
                    {

                        data?.map((user, idx)=>

                            <div
                            onClick = {() =>{
                                setModalOpen(true)
                                console.log(user)
                                setUserClicked(user);
                            }}
                            key={idx}
                            className={`hover:bg-gray-300 cursor-pointer text-center flex flex-row w-full md:w-[50rem] justify-between items-center h-auto md:h-[75px] px-2 py-2 md:py-0 transition-all duration-300 ${sideMenuToggled ? 'md:pl-[200px]' : 'pl-0'}`}>



                                <img src={user.WebsitePhotoURL ?? fallbackImage} className="h-10 md:h-[50px] aspect-auto rounded-sm" />
                                <p className="text-center flex-1 text-sm md:text-base">{user.FirstName} {user.LastName}</p>

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
            setQueryResults(res)
        })
        .catch(err =>{
            setQueryResults([])
            console.log("Error fetching user by email: ", err)
        })
    }else{
        const results = getUserByName(searchQuery);
        setQueryResults(results);
        console.log(results);
    }
}

//Modal attributes:
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const [modalOpen, setModalOpen] = useState(false)
const [userClicked, setUserClicked] = useState<User | null>(null)
const [editMode, seteditMode] = useState(false)

const setFilter = (name : String, value : String) =>{

}


    return(
        <div className="p-4 md:p-8 max-w-auto mx-auto bg-[rgb(248,247,252)] min-h-screen" id="SideMenuContainer">

            <SideMenu/>


                  <main className="flex pt-8 md:pt-[50px] gap-4 flex-col-reverse md:flex-row items-center md:items-start justify-center max-w-[100vw] bg-transparent">


                        {queryResults.length > 0 ? allBrothers(queryResults) : allBrothers(userData ?? [])}



                        <div className="flex flex-col gap-x-5 items-start justify-start relative h-max bg-transparent right-0 w-full md:w-auto">
                        <form onSubmit={handleInputSubmit} className="w-full">
                        <input placeholder='search' className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md" onChange={(e) =>{
                            setSearchQuery(e.target.value)
                            }} />
                            </form>

                        <div className="h-auto mt-6">
                            {
                                filters.map((itm, idx) =>{
                                    return(
                                        <div>
                                <h1 key={idx} className={`text-base md:text-xl ${idx < 0 ? "border-t border-black" : ""}`}>{itm}</h1>
                                

                                <div style = {{display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, marginTop: 10}}>
                                {
                                    filterValues[idx].map((_itm, _idx) =>{
                                        return(
                                            <div style = {{display: "flex", flexDirection:"row-reverse", gap: 10, justifyContent:"left", alignItems:"center"}}>
                                             <label>{_itm}</label>
                                             <input type = "checkbox" placeholder='Value' onChange = {() =>{ 
                                                //read from {selectedFilters} object: 
                                                switch(itm){
                                                    case "Position": 
                                                        setSelectedFilters({...selectedFilters, "Position": "TEST ITM" })
                                                        break; 
                                                    case "Grad Year": 
                                                        setSelectedFilters({...selectedFilters, "Grad Year": "TEST ITM" })
                                                        break; 
                                                    case "Committee":
                                                        setSelectedFilters({...selectedFilters, "Committee": "TEST" })
                                                        break; 
                                                    case "Class": 
                                                        setSelectedFilters({...selectedFilters, "Class": "TEST" })
                                                    default: 
                                                        console.log("The filter typoe is invalid or not identified in the object")
                                                }

                                                console.log(selectedFilters)
                                             }}/>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                                </div>
                                    )
                                })
                            }
                        </div>
                    </div>


                    <Modal

                    style = {{
                        overlay:{
                            display:"flex",
                            justifyContent:"center",
                            alignItems:"center",
                            transitionDuration:"0.5s"

                        },

                        content:{
                            border:"solid 1px lightgray",
                            outline:"none",
                            borderRadius: 10,
                            backgroundColor:"white",
                            padding: 0,
                            display:"flex",
                            alignContent:"center",
                            justifyContent:"flex-start",
                            alignItems:"flex-start",
                            selfAlign:"center",
                            transitionDuration:"0.5s"

                        }
                    }}
                    isOpen = {modalOpen}
                    contentLabel = "ViewEditMember Modal"

                    >
                        <div className="w-auto h-auto content-center pt-[100px] pl-[100px] justify-center items-center">

                            <div className="flex flex-row gap-[100px]">
                         <img src={userClicked?.WebsitePhotoURL ?? fallbackImage} className="h-10 md:h-[400px] aspect-auto rounded-sm" />
                         <div id = "detailsColumn" className="flex flex-col items-start justify-start">
                            {
                                !editMode?
                            <>
                            <p>Clout: {userClicked?.Clout ?? null}</p>
                            <p>Position: {userClicked?.Position ?? null}</p>
                            <p>Name: {userClicked?.FirstName ?? null} {userClicked?.LastName ?? null}</p>
                            <p>BUEmail: {userClicked?.BUEmail ?? null}</p>
                            <p>Major: {userClicked?.Major }</p>

                            {
                            userClicked?.Minor && <p>Minor: {userClicked?.Minor}</p>
                            }

                            <p>GradYear: {userClicked?.GradYear ?? null}</p>
                            <p>Class: {userClicked?.Class ?? "None"}</p>
                            <p>Colleges: {userClicked?.Colleges ?? "None"}</p>

                            </>
                            :
                            <>
                            <p>Clout: <input type="text" placeholder={userClicked?.Clout ?? ''} /></p>
                            <p>Position: <input type="text" placeholder={String(userClicked?.Position ?? '')} /></p>
                            <p >First Name: <input type="text" placeholder={userClicked?.FirstName ?? ''} /> </p>
                            <p >Last Name <input type="text" placeholder={userClicked?.LastName ?? ''} /></p>
                            <p>BUEmail: <input type="text" placeholder={userClicked?.BUEmail ?? ''} /></p>
                            <p>Major: <input type="text" placeholder={userClicked?.Major ?? ''} /></p>
                            <p>Minor: <input type="text" placeholder={userClicked?.Minor ?? ''} /></p>
                            <p>GradYear: <input type="text" placeholder={userClicked?.GradYear ?? ''} /></p>
                            <p>Class: <input type="text" placeholder={userClicked?.Class ?? 'None'} /></p>
                            <p>Colleges: <input type="text" placeholder={userClicked?.Colleges ?? ''} /></p>
                            </>
                            }

                            </div>
                            </div>


                    <div
                    id = "Controls"
                    className="w-auto flex self-end absolute bottom-[50px] right-[50px] flex-row gap-5"
                    >

                        {
                        !editMode?
                           <>
                        <button
                        className="bg-[#004C96] border border-[#004C96] rounded content-center flex cursor-pointer duration-1000 text-white px-6 py-0.5 text-xl"
                            onClick={ () => seteditMode(true)}
                        >

                            Edit

                        </button>


                           <button
                        className="bg-[#004C96] border border-[#004C96] rounded content-center flex cursor-pointer duration-1000 text-white px-6 py-0.5 text-xl"
                            onClick={ () => setModalOpen(false)}
                        >

                            Close

                        </button>
                        </>
                        :

                        <>
                          <button
                        className="bg-[#004C96] border border-[#004C96] rounded content-center flex cursor-pointer text-white px-6 py-0.5 text-xl"
                            onClick={ () => seteditMode(false)}
                        >

                            Save

                        </button>

                          <button
                        className="bg-transparent border border-[#004C96] rounded content-center flex cursor-pointer text-[#004C96] px-6 py-0.5 text-xl"
                            onClick={ () => setModalOpen(false)}
                        >

                            Discard

                        </button>
                        </>

                        }


                        </div>



                        </div>
                    </Modal>

                </main>




        </div>
    )
}
