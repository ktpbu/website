import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "../components/Scene";
import gsap from "gsap";
import { ReactLenis } from "lenis/react";
import { DataBaseDataContext } from "../contexts/DataBaseDataContext";
import axios from "axios";
import { RushEvents } from "../components/Timeline";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Define the type of your Rush Event if using TypeScript
interface RushEvent {
    _id?: string; // optional if coming from MongoDB
    Name: string;
    Day: string;
    Time: string;
    Location: string;
    Description: string;
}

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({
    question,
    answer,
    isOpen,
    onClick,
}) => (
    <div
        className="border-b border-gray-300 py-4 cursor-pointer"
        onClick={onClick}
    >
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{question}</h3>
            <span className="text-blue-700 text-2xl">{isOpen ? "-" : "+"}</span>
        </div>
        {isOpen && <p className="text-gray-600 mt-2">{answer}</p>}
    </div>
);

function Rush() {
    const RUSH_OPEN = true; 
    const rush_link = "http://docs.google.com/forms/d/e/1FAIpQLSe4ayYTwRyQ3LmH5aykjTkuddiXsR4Ez-8OqYm1ZodxQiuZFA/viewform"; 

    const lenisRef = useRef<{
        lenis?: {
            on: (event: string, handler: (e: any) => void) => void;
            raf: (time: number) => void;
        };
    } | null>(null);
    const [, setScrollY] = useState(0);
    const dataContext = React.useContext(DataBaseDataContext);
    const userData = dataContext?.userData;
    const vpOfRecruitment = userData?.find(
        (user: { Eboard_Position: string }) =>
            user.Eboard_Position === "VP of Recruitment"
    );


    const [openQuestion, setOpenQuestion] = useState(null);
    const faqs = [
        {
            question: "Who is eligible to rush KTP?",
            answer: "We welcome students from all majors and disciplines to rush! The only requirements are that you should have at least three semesters remaining in school after your pledging semester, have a 2.5 GPA or higher, and are not a member of another professional fraternity on campus",
        },
        {
            question: "What qualities does KTP value in rushees?",
            answer: "There’s no single 'ideal' candidate for KTP — our organization thrives on diversity and interdisciplinarity! Generally, the traits that make you unique are exactly what we’re looking for. Above all, we value individuals who share a genuine passion for technology, as that passion unites our members. Just be your self!",
        },
        {
            question: "What are the benefits of joining KTP?",
            answer: "KTP offers a community of tech enthusiasts who support each other academically, professionally, and socially. Members gain access to career mentorship, interview preparation, resume workshops, and guidance on coursework. Our network spans from innovative startups to major tech companies and big banks!",
        },
        {
            question: "What majors are represented in KTP?",
            answer: "KTP is composed of members from a wide range of academic backgrounds. Many of our members study data science, computer science, and engineering. However, we have members of many disciplines including business, math, statistics, economics, pre-med, and more. We all just share a passion for technology!",
        },
        {
            question: "What kind of events does KTP host?",
            answer: "KTP organizes a variety of social and professional events. Previous events have included hackathons, beach visits, formals, salsa dancing, pumpkin carving, and more! ",
        },
        {
            question: "How much time does the pledging process take?",
            answer: "The time commitment for pledging depends on your level of involvement. Our process is designed to be manageable for most schedules. If you have questions or want to learn more about KTP before rush, feel free to reach out to an e-board member.",
        },
    ];

    const toggleQuestion = (index: any) => {
        setOpenQuestion(openQuestion === index ? null : index);
    };

    // 3) Use the same events state you set up
    const [events, setEvents] = useState<RushEvent[]>([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        const handleScroll = (e: { scroll: React.SetStateAction<number> }) => {
            setScrollY(e.scroll); // Update scroll position
        };

        lenisRef.current?.lenis?.on("scroll", handleScroll);
        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await axios.get(`${backendUrl}/events`);
                setEvents(userResponse.data.data);
            } catch (error) {
                // console.error("Error fetching data in App:", error);
            }
        };
        fetchData();
    }, [backendUrl]);

    return (
        <ReactLenis root>
            {/* Existing Hero / Canvas Section */}
            <div className="w-full h-[300vh] relative xl:block hidden">
                <Canvas>
                    <Scene />
                </Canvas>
                <div className="absolute top-[9.5%] left-[50%] transform -translate-x-1/2 text-white text-[13rem] font-sfpro">
                    RUSH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;KTP
                </div>
                <div className="absolute top-[19%] left-[6.5%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro">
                    EST 2012
                </div>
                <div className="absolute top-[19%] left-[41.5%] transform -translate-x-1/2 text-white text-[0.8rem] font-sfpro">
                    BOSTON
                </div>
                <div className="absolute top-[19%] right-[28.75%] transform translate-x-1/2 text-white text-[0.8rem] font-sfpro">
                    LAMBDA
                </div>
            </div>

            <div className="w-full">
                {/* Title Section */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="mt-10 text-5xl font-sfpro font-bold mb-4">
                        Welcome to{" "}
                        <span className="bg-ktp-appblue text-white px-2 py-1 rounded inline-block leading-relaxed">
                            {new Date().getMonth() < 6 ? "Spring" : "Fall"}{" "}
                            {new Date().getFullYear()}
                        </span>{" "}
                        Rush!
                    </div>
                    <div className="mt-1 text-3xl text-gray-400 font-bold">
                        Learn about joining KTP
                    </div>
                </div>

                {/* Button Section */}
                <div className="mt-10 flex justify-center space-x-4">
                    {/* Interest Form Button */}
                    <div className="flex flex-col items-center">
                        <button className="bg-transparent text-ktp-appblue border-2 border-ktp-appblue px-6 py-2 rounded hover:bg-ktp-appblue hover:text-white transition duration-300 relative group">
                            <a
                                href="https://forms.gle/8G1HA6TkZrZsEKH47"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Interest Form{" "}
                                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                                    &#8250;
                                </span>
                            </a>
                        </button>
                    </div>

                    {/* Application Form Button */}
                    <div className="flex flex-col items-center">
                        <button
                            className={`bg-transparent text-ktp-appblue border-2 border-ktp-appblue px-6 py-2 rounded transition duration-300 relative group ${
                                RUSH_OPEN 
                                    ? 'hover:bg-ktp-appblue hover:text-white cursor-pointer' 
                                    : 'opacity-50 cursor-not-allowed'
                            }`}
                            disabled={!RUSH_OPEN}
                        >
                        <a
                                href={RUSH_OPEN ? rush_link : undefined}
                                target={RUSH_OPEN ? "_blank" : undefined}
                                rel={RUSH_OPEN ? "noopener noreferrer" : undefined}
                                className={RUSH_OPEN ? '' : 'pointer-events-none'}
                            >
                            Application Form{" "}
                            <span className={`inline-block transition-transform duration-300 ${RUSH_OPEN ? 'group-hover:translate-x-1' : ''}`}>
                                &#8250;
                            </span>
                            </a>
                        </button>
                        <div className="flex items-center mt-2">
                            <span className="flex items-center">
                                <span
                                    className={`mr-2 w-2 h-2 rounded-full ${RUSH_OPEN ? 'bg-green-600 animate-fade' : 'bg-red-600'}`}
                                ></span>
                                <p className={`${RUSH_OPEN ? 'text-green-600' : 'text-red-600'}`}>
                                    {RUSH_OPEN ? 'Application Open' : 'Application Closed'}
                                </p>
                            </span>
                            <style>
                                {`
                                    @keyframes fadeInOut {
                                        0%, 100% { opacity: 0; }
                                        50% { opacity: 1; }
                                    }
                                    .animate-fade {
                                        animation: fadeInOut 1.5s infinite;
                                    }
                                `}
                            </style>
                        </div>
                    </div>
                </div>

                {/* VP Recruitment Section */}
                <div className="flex flex-col md:flex-row items-center justify-center my-20 px-10">
                    {/* Image Section */}
                    <div className="mb-6 md:mb-0">
                        {vpOfRecruitment?.WebsitePhotoURL ? (
                            // Once the image data is available, render the image
                            <img
                                src={`${vpOfRecruitment?.WebsitePhotoURL}`}
                                alt={`${vpOfRecruitment?.FirstName} ${vpOfRecruitment?.LastName}`}
                                className="rounded-md shadow-lg object-cover w-60 h-120"
                            />
                        ) : (
                            <Skeleton width={240} height={350} />
                        )}
                    </div>

                    {/* Text Section */}
                    <div className="bg-gray-100 p-6 rounded-md md:ml-10">
                        <h1 className="text-2xl text-ktp-appblue font-bold mb-4">
                            Why Rush KTP?
                        </h1>
                        <p className="text-base mb-4">
                            Dear Prospective Members,
                        </p>
                        <p className="text-base mb-4 max-w-prose">
                            As the Vice President of Recruitment of Kappa Theta
                            Pi, I invite you to Rush KTP and become part of our
                            exceptional organization. As the first technology
                            fraternity, we offer unique opportunities for
                            members to develop skills, knowledge, and
                            professional networks. Our community shares a strong
                            passion and commitment for technology and
                            innovation. We prioritize building a strong
                            brotherhood and promoting social activities with
                            members from a multitude of backgrounds. This
                            multidisciplinary membership provides a unique
                            opportunity for members to learn and advance from
                            each other.
                        </p>
                        <p className="text-base">
                            Sincerely,
                            <br />
                            {vpOfRecruitment?.FirstName}{" "}
                            {vpOfRecruitment?.LastName}
                            <br />
                            {vpOfRecruitment?.Eboard_Position}
                        </p>
                    </div>
                </div>

                {/* 4) Rush Events Timeline Section (Bottom of Page) */}
                <div className="px-4 py-10">
                    <h2 className="text-center text-2xl sm:text-4xl font-black text-ktp-appblue mb-10">
                        Upcoming Rush Events
                    </h2>
                    {/* Pass your "events" state directly to RushEvents */}
                    <RushEvents events={events} />
                </div>

                <div className="mt-16 mb-16 relative z-10">
                    <h2 className="text-center text-2xl sm:text-4xl font-black text-ktp-appblue mb-10">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-8 px-20">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openQuestion === index}
                                onClick={() => toggleQuestion(index)}
                            />
                        ))}
                    </div>
                    <h2 className="mx-10 text-center text-xl sm:text-2xl font-bold text-ktp-appblue my-10">
                        Have more questions? Ask our new chatbot, KTPaul!
                    </h2>
                </div>
            </div>
        </ReactLenis>
    );
}

export default Rush;
