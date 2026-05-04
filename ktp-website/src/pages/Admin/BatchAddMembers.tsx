import { useEffect, useRef, useState } from "react";
import { storage, firestore } from '../../firebase/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import SideMenu from "../../components/Admin/SideMenu";
import fallbackImage from "../../img/KTPLogo.jpeg";
import Modal from "react-modal";

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

export default function BatchAddMembers() {
    const [newMembers, setNewMembers] = useState<User[]>([]);
    const [edittingUser, setEdittingUser] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newUserInFocus, setNewUserInFocus] = useState<User>({} as User);
    const [modalOpen, setModalOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    function deleteNewMemmber(idx: number) {
        setNewMembers(prev => prev.filter((_, i) => i !== idx));
    }

    function closeModal() {
        setModalOpen(false);
        setEdittingUser(false);
        setEditingIndex(null);
    }

    async function handleOnboardNewMemebers() {
        if (newMembers.length === 0) return;
        try {
            for (const member of newMembers) {
                const userData = { ...member };
                delete userData.photoFile;
                delete userData.WebsitePhotoURL;
                const docRef = await addDoc(collection(firestore, 'users'), userData);
                const id = docRef.id;

                if (member.photoFile) {
                    const fileRef = storageRef(storage, `Website Brother Photos/${id}.jpeg`);
                    await uploadBytes(fileRef, member.photoFile);
                    const downloadURL = await getDownloadURL(fileRef);
                    await updateDoc(doc(firestore, 'users', id), { WebsitePhotoURL: downloadURL });
                }
            }
            alert(`Successfully onboarded ${newMembers.length} member(s)!`);
            setNewMembers([]);
        } catch (error) {
            console.error('Error onboarding members:', error);
            alert('Failed to onboard some members. Check the console for details.');
        }
    }

    // Uses the input's `name` attribute as the field key instead of `placeholder`,
    // so renaming placeholder text never silently breaks field mapping.
    function handleFieldInputs(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.currentTarget.name as keyof User;
        const value = e.currentTarget.value;
        if (name === 'Position') {
            setNewUserInFocus(prev => ({ ...prev, Position: Number(value) }));
        } else {
            setNewUserInFocus(prev => ({ ...prev, [name]: value }));
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            if (newUserInFocus.WebsitePhotoURL?.startsWith('blob:')) {
                URL.revokeObjectURL(newUserInFocus.WebsitePhotoURL);
            }
            const url = URL.createObjectURL(file);
            setNewUserInFocus(prev => ({ ...prev, WebsitePhotoURL: url, photoFile: file }));
        }
    }

    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

    const Controls = (
        <div id="Controls" className="w-auto flex self-end absolute bottom-[50px] right-[50px] flex-row gap-5">
            <button
                className={`bg-[#004C96] border border-[#004C96] rounded content-center flex duration-1000 text-white px-6 py-0.5 text-xl ${newMembers.length === 0 ? 'cursor-auto opacity-50' : 'cursor-pointer opacity-100'}`}
                onClick={handleOnboardNewMemebers}
                disabled={newMembers.length === 0}
            >
                Onboard
            </button>
        </div>
    );

    const PlaceHolderItm = (
        <div
            className="bg-black/15 w-[150px] h-[200px] rounded-[10px] content-center items-center flex justify-center cursor-pointer"
            onClick={() => {
                setNewUserInFocus({} as User);
                setModalOpen(true);
            }}
        >
            <ControlPointIcon className="text-black/50" />
        </div>
    );

    return (
        <div className="flex flex-row gap-[50px] p-4 md:p-8 max-w-auto mx-auto bg-[rgb(248,247,252)] min-h-screen" id="SideMenuContainer">
            <SideMenu />
            <div className="pt-20 flex flex-row gap-16">
                {newMembers.length > 0 ? (
                    <>
                        {newMembers.map((itm, idx) => (
                            // key uses idx because new members have no stable id yet
                            <div key={idx}>
                                <div className="bg-black/15 w-[150px] h-[200px] rounded-[10px] content-center items-center flex justify-center">
                                    <img src={itm.WebsitePhotoURL || fallbackImage} />
                                </div>
                                <div id="newMembersQuickActionButtons" className="flex flex-col gap-2.5 py-2.5">
                                    <button onClick={() => {
                                        setNewUserInFocus(itm);
                                        setEditingIndex(idx);
                                        setModalOpen(true);
                                        setEdittingUser(true);
                                    }}>
                                        <EditIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => deleteNewMemmber(idx)}>
                                        <ClearIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {PlaceHolderItm}
                    </>
                ) : PlaceHolderItm}
            </div>

            {Controls}

            <Modal
                style={{
                    overlay: { display: "flex", justifyContent: "center", alignItems: "center", transitionDuration: "0.5s" },
                    content: {
                        border: "solid 1px lightgray",
                        outline: "none",
                        borderRadius: 10,
                        backgroundColor: "white",
                        padding: 0,
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        transitionDuration: "0.5s"
                    }
                }}
                isOpen={modalOpen}
                onRequestClose={closeModal}
                contentLabel="ViewEditMember Modal"
            >
                <div className="w-auto h-auto content-center pt-[100px] pl-[100px] justify-center items-center">
                    <div className="flex flex-row gap-[100px]">
                        <div className="w-[300px] h-[300px] overflow-hidden rounded-[10px] cursor-pointer relative">
                            <img
                                src={newUserInFocus.WebsitePhotoURL || fallbackImage}
                                className={`w-full h-full object-cover ${newUserInFocus.WebsitePhotoURL ? '' : 'brightness-[0.6]'}`}
                            />
                            <div
                                id="editImageOverlay"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute top-0 left-0 w-full h-full flex justify-center items-center"
                            >
                                <ControlPointIcon id="plusIcon" className="text-white/75 text-[40px]" />
                            </div>
                            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                        </div>

                        <div id="detailsColumn" className="flex flex-col items-start justify-start">
                            <p>Clout: <input type="number" name="Clout" placeholder="Initial Clout" value={newUserInFocus.Clout ?? ''} onChange={handleFieldInputs} /></p>
                            <p>Position: <input type="text" name="Position" placeholder="Position (0–4)" value={newUserInFocus.Position ?? ''} onChange={handleFieldInputs} /></p>
                            <p>First Name: <input type="text" name="FirstName" placeholder="First Name" value={newUserInFocus.FirstName ?? ''} onChange={handleFieldInputs} /></p>
                            <p>Last Name: <input type="text" name="LastName" placeholder="Last Name" value={newUserInFocus.LastName ?? ''} onChange={handleFieldInputs} /></p>
                            <p>BUEmail: <input type="text" name="BUEmail" placeholder="BU Email" value={newUserInFocus.BUEmail ?? ''} onChange={handleFieldInputs} /></p>
                            <p>Major: <input type="text" name="Major" placeholder="Major" value={newUserInFocus.Major ?? ''} onChange={handleFieldInputs} /></p>
                            <p>Minor: <input type="text" name="Minor" placeholder="Minor" value={newUserInFocus.Minor ?? ''} onChange={handleFieldInputs} /></p>
                            <p>GradYear: <input type="text" name="GradYear" placeholder="Grad Year" value={newUserInFocus.GradYear ?? ''} onChange={handleFieldInputs} /></p>
                            <p>Class: <input type="text" name="Class" placeholder="Class" value={newUserInFocus.Class ?? ''} onChange={handleFieldInputs} /></p>
                            <p>Colleges: <input type="text" name="Colleges" placeholder="Colleges" value={newUserInFocus.Colleges ?? ''} onChange={handleFieldInputs} /></p>
                        </div>
                    </div>

                    <div id="Controls" className="w-auto flex self-end absolute bottom-[50px] right-[50px] flex-row gap-5">
                        <button
                            className="bg-[#004C96] border border-[#004C96] rounded content-center flex cursor-pointer text-white px-6 py-0.5 text-xl"
                            onClick={() => {
                                if (edittingUser && editingIndex !== null) {
                                    setNewMembers(prev => prev.map((itm, i) => i === editingIndex ? newUserInFocus : itm));
                                } else {
                                    setNewMembers(prev => [...prev, newUserInFocus]);
                                }
                                closeModal();
                            }}
                        >
                            Save
                        </button>
                        <button
                            className="bg-transparent border border-[#004C96] rounded content-center flex cursor-pointer text-[#004C96] px-6 py-0.5 text-xl"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
