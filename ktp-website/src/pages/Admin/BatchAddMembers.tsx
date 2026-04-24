import { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { storage, firestore } from '../../firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Edit, MenuIcon } from "lucide-react";
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import SideMenu from "../../components/Admin/SideMenu";
import fallbackImage from "../../img/KTPLogo.jpeg";
import Modal from "react-modal"
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
  photoFile?: File;
}

interface DataBaseDataContextType {
  userData?: User[];
}


export default function BatchAddMembers(){


//const [newMembers, setNewMembers] = useState([{FirstName: "Test", LastName:"A"}, {FirstName: "Test", LastName:"B"}, {FirstName: "Test", LastName:"c"}] as User[]);
const [newMembers, setNewMembers] = useState([] as User[]);
const [edittingUser, setEdittingUser] = useState(false)
const [editingIndex, setEditingIndex] = useState<number | null>(null)
const [newUserInFocus, setNewUserInFocus] = useState({} as User) //the current user object which is being created (ie new User's object)
//modal vars
const [modalOpen, setModalOpen] = useState(false);

const fileInputRef = useRef<HTMLInputElement>(null);

const backendUrl = import.meta.env.VITE_LOCAL_BACKEND_URL;


function deleteNewMemmber(idx : number){
    let leftHemi = newMembers.slice(0, idx)
    let rightHemi = newMembers.slice(idx+1, newMembers.length);

    let newArray = leftHemi.concat(rightHemi)

    setNewMembers(newArray);

   // console.log(newArray)

}


const Controls = (
     <div
                    id = "Controls"
                    className="w-auto flex self-end absolute bottom-[50px] right-[50px] flex-row gap-5"
                    >



                        <button
                        className={`bg-[#004C96] border border-[#004C96] rounded content-center flex duration-1000 text-white px-6 py-0.5 text-xl ${newMembers.length == 0 ? 'cursor-auto opacity-50' : 'cursor-pointer opacity-100'}`}
                            onClick={handleOnboardNewMemebers}
                        >

                            Onboard

                        </button>

        </div>
)
const PlaceHolderItm = (
    <div
    className="bg-black/15 w-[150px] h-[200px] rounded-[10px] content-center items-center flex justify-center cursor-pointer"
    onClick = { () =>{
        setNewUserInFocus({} as User)
        setModalOpen(true)

    }}
    >

        <ControlPointIcon className="text-black/50" />
    </div>
)


useEffect(()=>{
  //console.log(newMembers)
}, [newMembers]);




async function handleOnboardNewMemebers(){
    try {
        for (const member of newMembers) {
            const userData = { ...member };
            delete userData.photoFile;
            delete userData.WebsitePhotoURL; // Remove temp URL
            const docRef = await addDoc(collection(firestore, 'users'), userData);
            const id = docRef.id;

            let downloadURL = null;
            if (member.photoFile) {
                const fileRef = storageRef(storage, `Website Brother Photos/${id}.jpeg`);
                await uploadBytes(fileRef, member.photoFile);
                downloadURL = await getDownloadURL(fileRef);
                await updateDoc(doc(firestore, 'users', id), { WebsitePhotoURL: downloadURL });

            }
        }
        console.log('All members onboarded successfully', newMembers);
        setNewMembers([]); // Clear after success
    } catch (error) {
        console.error('Error onboarding members:', error);
    }
}



function handleFieldInputs(e : any){
    e.preventDefault();
    const placeholder = e.currentTarget.placeholder;
    const value = e.currentTarget.value;

    switch (placeholder){
        case "Initial Clout":
            setNewUserInFocus(prev => ({...prev, Clout: value}));
            break;
        case "Position":
            setNewUserInFocus(prev => ({...prev, Position: Number(value)}));
            break;
        case "First Name":
            setNewUserInFocus(prev => ({...prev, FirstName: value}));
            break;
        case "Last Name":
            setNewUserInFocus(prev => ({...prev, LastName: value}));
            break;
        case "BU Email":
            setNewUserInFocus(prev => ({...prev, BUEmail: value}));
            break;
        case "Major":
            setNewUserInFocus(prev => ({...prev, Major: value}));
            break;
        case "Minor":
            setNewUserInFocus(prev => ({...prev, Minor: value}));
            break;
        case "Grad Year":
            setNewUserInFocus(prev => ({...prev, GradYear: value}));
            break;
        case "Class":
            setNewUserInFocus(prev => ({...prev, Class: value}));
            break;
        case "Colleges":
            setNewUserInFocus(prev => ({...prev, Colleges: value}));
            break;
        default:
            console.log("Unknown input placeholder:", placeholder);
            break;
    }
}

function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
        if (newUserInFocus.WebsitePhotoURL?.startsWith('blob:')) {
            URL.revokeObjectURL(newUserInFocus.WebsitePhotoURL);
        }
        const url = URL.createObjectURL(file);
        setNewUserInFocus(prev => ({...prev, WebsitePhotoURL: url, photoFile: file}));
    }
}



    return(
    <div className="flex flex-row gap-[50px] p-4 md:p-8 max-w-auto mx-auto bg-[rgb(248,247,252)] min-h-screen" id="SideMenuContainer">
  <SideMenu/>
        <div className="pt-20 flex flex-row gap-16">

            {

                newMembers.length > 0?
                <>
                {
                newMembers.map((itm, idx) =>{
                    return(
                        <div>
                        <div
                        className="bg-black/15 w-[150px] h-[200px] rounded-[10px] content-center items-center flex justify-center"
                        >

                            <img src = {itm.WebsitePhotoURL || fallbackImage}/>

                            </div>

                            <div
                            id = "newMembersQuickActionButtons"
                            className="flex flex-col gap-2.5 py-2.5"
                            >
                                <button onClick = {() => {
                                setNewUserInFocus(itm);
                                setEditingIndex(idx);
                                setModalOpen(true)
                                setEdittingUser(true)

                                }}><EditIcon className="h-5 w-5"/></button>
                                <button onClick = {() => deleteNewMemmber(idx)} ><ClearIcon className="h-5 w-5"/></button>
                                </div>
                                </div>
                    )
                })
            }
                {PlaceHolderItm}
                    </>
                :
                PlaceHolderItm

            }
        </div>

        {Controls}

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
                            <div className="w-[300px] h-[300px] overflow-hidden rounded-[10px] cursor-pointer relative">

                                <img src={newUserInFocus.WebsitePhotoURL || fallbackImage} className={`w-full h-full object-cover ${newUserInFocus.WebsitePhotoURL ? '' : 'brightness-[0.6]'}`} />

<div id = "editImageOverlay" onClick = {() => fileInputRef.current?.click()} className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
    <ControlPointIcon id = "plusIcon" className="text-white/75 text-[40px]" />
</div>

<input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

                            </div>

                         <div id = "detailsColumn" className="flex flex-col items-start justify-start">

                            <p>Clout: <input type="number" placeholder={'Initial Clout'} value = {newUserInFocus.Clout} onChange={handleFieldInputs}/></p>
                            <p>Position: <input type="text" placeholder={"Position"} onChange={handleFieldInputs} /></p>
                            <p >First Name: <input type="text" placeholder={"First Name"}  onChange={handleFieldInputs} /> </p>
                            <p >Last Name <input type="text" placeholder={"Last Name"} onChange={handleFieldInputs} /></p>
                            <p>BUEmail: <input type="text" placeholder={"BU Email"} onChange={handleFieldInputs} /></p>
                            <p>Major: <input type="text" placeholder={"Major"} onChange={handleFieldInputs} /></p>
                            <p>Minor: <input type="text" placeholder={"Minor"} onChange={handleFieldInputs} /></p>
                            <p>GradYear: <input type="text" placeholder={"Grad Year"}  onChange={handleFieldInputs}/></p>
                            <p>Class: <input type="text" placeholder={"Class"}  onChange={handleFieldInputs}/></p>
                            <p>Colleges: <input type="text" placeholder={"Colleges"} onChange={handleFieldInputs} /></p>

                            </div>
                            </div>



                    <div
                    id = "Controls"
                    className="w-auto flex self-end absolute bottom-[50px] right-[50px] flex-row gap-5"
                    >


                          <button
                        className="bg-[#004C96] border border-[#004C96] rounded content-center flex cursor-pointer text-white px-6 py-0.5 text-xl"
                            onClick={async () => {

                              if (edittingUser && editingIndex !== null) {
                                const updatedUser = newUserInFocus;
                                if (updatedUser.photoFile && updatedUser.id) {
                                  const fileRef = storageRef(storage, `users/${updatedUser.id}.jpeg`);
                                  await uploadBytes(fileRef, updatedUser.photoFile);
                                  const downloadURL = await getDownloadURL(fileRef);
                                  await updateDoc(doc(firestore, 'users', updatedUser.id), { WebsitePhotoURL: downloadURL });
                                  updatedUser.WebsitePhotoURL = downloadURL;
                                }
                                setNewMembers(prev => prev.map((itm, i) => i === editingIndex ? updatedUser : itm));
                                setEdittingUser(false);
                                setEditingIndex(null);
                                setModalOpen(false);
                              } else {
                                 setNewMembers(prev => [...prev, newUserInFocus]);
                                 setModalOpen(false);
                              }
                            }}
                        >

                            Save

                        </button>

       <button
                        className="bg-[transparent] border border-[#004C96] rounded content-center flex cursor-pointer text-[#004C96] px-6 py-0.5 text-xl"
                            onClick={async () => {
                                setModalOpen(false)
                            }}
                        >

                            Cancel

                        </button>

                        </div>


                        </div>
                    </Modal>


        </div>
    )

}
