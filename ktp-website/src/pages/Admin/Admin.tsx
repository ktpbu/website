import react, {useState} from "react"
import {FcGoogle} from "react-icons/fc"
import {auth} from "../../firebase/firebase"
import {useNavigate, } from 'react-router-dom'
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { ALLOWED_ADMIN_EMAILS } from "../../constants/adminEmails";


export default function Admin(){
    const nav  = useNavigate()
  const [error, setError] = useState("")

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {

          const result = await signInWithPopup(auth, provider);
          const email = result.user.email;

          if (!email?.includes("@bu.edu")) {
            //email is not in bu doamin : sign them out
            setError("This email is not authorized. Please try a different one")
            await auth.signOut();
            return
          }

        //email is within bu domain, check if its one of the allowed emails
        if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
              setError("Access Denied: You are not an authorized admin.");
              await auth.signOut();
              return
        }else{
            //success : email is wihtin bu domain and is one of the allowed emails
            nav("/adminDashboard")

        }



        } catch (err) {
          setError("Login failed. Please try again.");
          console.log(err)
        }
      };


    const GoogleSignInButton = (
          <button id="GoogleSignInButton"
          onClick={() => {handleLogin()}}
          className="gap-x-2.5 flex flex-row content-center justify-center items-center rounded-lg border-white border-2 px-3 py-1 text-white bg-transparent hover:text-black hover:bg-white transition-all duration-300">
            {/*Google Icon */}
            <FcGoogle className="h-6 w-6"/>
             Sign In With Google
          </button>
    )


    return(
        <div className="text-center content-center w-full h-screen bg-[rgb(19,75,145)] px-4">

        <div className="bg-transparent flex flex-col gap-y-8 md:gap-y-[50px] items-center">

               <h1 className="text-xl md:text-[72px] font-bold text-white">KTAdmin</h1>


               <div id="auth">
               {GoogleSignInButton}
               </div>


               <p className="text-red-500 text-sm md:text-base px-2">{error}</p>


        </div>

        </div>
    )
}
