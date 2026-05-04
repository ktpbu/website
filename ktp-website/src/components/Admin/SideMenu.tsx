import { MenuIcon } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
export default function SideMenu(){
        const [sideMenuToggled, toggleSideMenu] = useState(false)

        const nav = useNavigate() 
     const SideMenu = (
            <div
            className={`p-8 fixed bg-white transition-all duration-300 top-0 w-[200px] md:w-[200px] z-[1000] h-full md:h-full ${sideMenuToggled ? 'left-0' : '-left-[220px]'}`}>
                <MenuIcon onClick={() => toggleSideMenu(!sideMenuToggled)} className="cursor-pointer float-right" />

                <ul className="flex flex-col gap-y-5 list-none p-0 mt-[50px] h-[85vh]">
                    <li className="bg-white cursor-pointer text-left" onClick = {() => nav("/adminDashboard")}>
                        <p className="active:opacity-50">Dashboard</p>
                    </li>
                    <li className="bg-transparent cursor-pointer text-left border-t border-[rgb(198,198,198)] pt-5" onClick = {() => nav("/adminBatchAddMembers")}>
                        <p className="active:opacity-50">Add Members</p>
                    </li>

                    <li className="bg-transparent cursor-pointer text-left border-t border-[rgb(198,198,198)] pt-5 text-red-500 mt-auto">
                        <p className="active:opacity-50">Logout</p>
                    </li>
                </ul>



            </div>
        )


    return(
        <>

                 <MenuIcon onMouseEnter={() => toggleSideMenu(!sideMenuToggled)} className="cursor-pointer" />
                {SideMenu}
        
        </>
    )
}