import react, {useState} from "react"
import {FcGoogle} from "react-icons/fc"
import {auth} from "../../firebase/firebase"
import {useNavigate, } from 'react-router-dom'
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { env } from "process"
import axios from "axios"
const ALLOWED_EMAILS = [
    "president@ktp-bostonu.com", 
    "tech-chair@ktp-bostonu.com",
    "ander010@bu.edu"
];


export default function Admin(){
    const nav  = useNavigate() 
  const [error, setError] = useState("")
  //const auth = getAuth();

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
        if (!ALLOWED_EMAILS.includes(email)) {
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
    

    const googleButtonDImension = 24
    const [mouseOver, setMouseOver] = useState(false) 
    const GoogleSignInButton = (
          <button id = "GoogleSignInButton"  
          onClick={() => {handleLogin()}}
          onMouseEnter={(e) =>setMouseOver(true)} 
          onMouseLeave={() => setMouseOver(false)}
          style= {{
            columnGap: 10, 
            display: "flex", 
            flexDirection:"row", 
            alignContent:"center", 
            justifyContent:"center", 
            alignItems:"center",
             borderRadius: 8, 
            borderColor: "white", 
            borderWidth: 2,
            paddingInline: 12,
            paddingBlock: 4,
            color: mouseOver? "black" : "white",
            backgroundColor: mouseOver ? "white" : "transparent",
            transitionDuration: "0.25s"
            }}>
            {/*Google Icon */}
            <FcGoogle style = {{height: googleButtonDImension, width: googleButtonDImension}}/>
             Sign In With Google
          </button>
    )


    return(
        <div style = {{
            textAlign: "center",
            alignContent:"center",
            width: "100%",
            height: "100vh",
            backgroundColor: "rgb(19, 75, 145)"
        }}> 

        <div 
        id = ""
        style = {{
             backgroundColor:"transparent",
             display:"flex",
             flexDirection: "column",
             rowGap: 50,
             alignItems:"center"
        }}>

               <h1 style  = {{
                fontSize: 25,
                fontWeight: "bold",
                color: "white"
               }}>KTAdmin</h1>


               <div id = "auth">
               {GoogleSignInButton}
               </div>


               <p style = {{color:"red"}}>{error}</p>


        </div>
        
        </div>
    )
}