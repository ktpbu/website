// src/App.tsx

import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Brothers from "./pages/Brothers";
import Rush from "./pages/Rush";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin/Admin";
import AdminLogin from "./pages/Admin/AdminLogin";
import Error from "./pages/Error";

import Header from "./components/Header";
import Footer from "./components/Footer";
// import ChatWidget from "./components/ChatWidget";
// import ChatbotProvider from "./contexts/ChatbotContext";
import { useState, useEffect } from "react";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL; //change back to VITE_BACKEND_URL for production 
import { DataBaseDataContext } from "./contexts/DataBaseDataContext";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import BackToTop from "./components/ScrollTop";
import AdminDashboard from "./pages/Admin/AdminDashoard";
// import { SnackbarProvider } from "notistack";

function App() {
    //DB access for entire app
    const [userData, setUserData] = useState(null);
    const [pictureData, setPictureData] = useState(null);
    const location = useLocation();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${backendUrl}/users`);
                const pictureResponse = await axios.get(
                    `${backendUrl}/websitePics`
                );

                setUserData(userResponse.data.data);
                setPictureData(pictureResponse.data.data);
            } catch (error) {
                console.error("Error fetching data in App:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header at the top */
            !location.pathname.includes("admin") && <Header/>
            }

            {/* Google analytics, ask KIEFER */}
            {/* <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-PDTMQKQPZ0"
            ></script>
            <script>
                (window as any).dataLayer = (window as any).dataLayer || [];
                function gtag(){(window as any).dataLayer.push(arguments)}
                gtag('js', new Date()); gtag('config', 'G-PDTMQKQPZ0');
            </script> */}
            {/* Main content area (grow to fill) */}
            <main className="flex-grow">
                {/* Wrap Routes with DataBaseDataContext.Provider */}
                <DataBaseDataContext.Provider value={{ userData, pictureData }}>
                    <AnimatePresence mode="wait">
                        <BackToTop />
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/brothers" element={<Brothers />} />
                            <Route path="/rush" element={<Rush />} />
                            <Route path="/contact" element={<Contact />} />

                            {/*Admin page route : START */}
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/adminDashboard" element={<AdminDashboard />} />
                            {/*Admin page route : END */}
                            <Route path="*" element={<Error />} />

                        </Routes>
                    </AnimatePresence>
                </DataBaseDataContext.Provider>
            </main>

            {/* Chatbot */}
            {/* <SnackbarProvider>
                <ChatbotProvider>
                    <ChatWidget />
                </ChatbotProvider>
            </SnackbarProvider> */}
            {/* Footer at the bottom */
            !location.pathname.includes("admin") &&  <Footer /> 
            }
      
        </div>
    );
}

export default App;
