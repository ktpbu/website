// src/pages/Brothers.tsx
import { useEffect, useState, useContext } from "react";
import fallbackImage from "../img/KTPLogo.jpeg";
import Icons from '../components/Icons';
import { DataBaseDataContext } from "../contexts/DataBaseDataContext";

// Example interface for a single user/brother object
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


// Example interface for the context's value
interface DataBaseDataContextType {
  userData?: User[];
}

function Brothers() {
  //DB DATA
  const dataContext = useContext(DataBaseDataContext) as DataBaseDataContextType | null;
  const userData = dataContext?.userData;

  // Possible tabs
  type Tab = "Actives" | "E-Board" | "Alumni";

  // State
  const [activeTab, setActiveTab] = useState<Tab>("Actives");
  const [brotherName, setBrotherName] = useState<User[]>([]);
  const [eboardName, setEboardName] = useState<User[]>([]);
  const [alumniName, setAlumniName] = useState<User[]>([]);

  // TypeWriter Functions
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>("");
  const [charIndex, setCharIndex] = useState<number>(0);
  const Sentences: string[] = ["Developers", "Engineers", "Innovators", "Leaders", "Researchers"];

  useEffect(() => {
    const typeWriter = () => {
      const currentSentence = Sentences[currentSentenceIndex];
      if (charIndex < currentSentence.length) {
        setCurrentText(currentSentence.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCharIndex(0);
          if (currentSentenceIndex + 1 < Sentences.length) {
            setCurrentSentenceIndex(currentSentenceIndex + 1);
            setCurrentText(""); // Reset the base text
          } else {
            setCurrentSentenceIndex(0);
            setCurrentText(""); // Reset the base text
          }
        }, 1500); // Pause before transitioning to the next word
      }
    };
    const typingTimeout = setTimeout(typeWriter, 100); // Typing speed
    return () => clearTimeout(typingTimeout);
  }, [charIndex, currentSentenceIndex, Sentences]);

  const filterAndCategorizeNames = (data: User[]) => {
    const brothers = data.filter((brother) => !brother.Eboard_Position);
    const eboardMembers = data.filter((brother) => Boolean(brother.Eboard_Position));
    return { brothers, eboardMembers };
  };

  const groupByClass = (brothers: User[]) => {
    return brothers.reduce<Record<string, User[]>>((classMap, brother) => {
      const className = brother.Class || "Unknown"; // Default to "Unknown" if Class is missing
      if (!classMap[className]) {
        classMap[className] = [];
      }
      classMap[className].push(brother);
      return classMap;
    }, {});
  };

  const letters: string[] = [
    "Omega", "Psi", "Chi", "Phi", "Upsilon", "Tau", "Sigma", "Rho",
    "Pi", "Omicron", "Xi", "Nu", "Mu", "Lambda", "Kappa", "Iota",
    "Theta", "Eta", "Zeta", "Epsilon", "Delta", "Gamma", "Beta", "Alpha", "Co-founder"
  ];

  const errorHandlingLinkedIn = (linkedIn?: string): string => {
    if (!linkedIn) {
      // If LinkedIn is empty, return the default company page
      return "https://www.linkedin.com/company/kappa-theta-pi-lambda-chapter/";
    }
    if (linkedIn.startsWith("https://")) {
      // If it already starts with https://, return as is
      return linkedIn;
    }
    if (linkedIn.startsWith("http://")) {
      // If it already starts with http://, return as is //edge case for griffin http
      return linkedIn;
    }
    if (linkedIn.startsWith("www.linkedin.com")) {
      // If it starts with www.linkedin.com, prepend https://
      return `https://${linkedIn}`;
    }
    // Otherwise, assume it's just the username and construct the full URL
    return `https://www.linkedin.com/in/${linkedIn}`;
  };

  useEffect(() => {
    if (userData) {
      // Separate alumni from other positions
      const alumni = userData.filter((user) => Number(user.Position) === 4);
      setAlumniName(alumni);

      let filteredUsers = userData.filter((user) =>
        [2, 3, 5].includes(Number(user.Position) ?? 0)
      );

      // Join users with pictures based on `id` and `websitePic`
      const brothersWithPictures = filteredUsers.map((user) => {
        let pictureUrl: string | null = null;
        // Find the matching picture

        return {
          ...user,
          pictureUrl,
        };
      });

      // Categorize into brothers and e-board members
      const { brothers, eboardMembers } = filterAndCategorizeNames(brothersWithPictures);
      setBrotherName(brothers);
      setEboardName(eboardMembers);
    }
  }, [userData]);

  return (
    <div className="w-full py-8 px-4">
      {/* Typewriter Effect */}
      {/* Centered Header */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl text-ktp-appblue font-bold mb-4">
          Our Brothers Are{" "}
          <span className="underline decoration-2 underline-offset-2">
            {currentText}
          </span>
        </h1>
        <p className="text-gray-700 leading-relaxed">
          Our fraternity is made up of diverse individuals from various
          backgrounds and disciplines. Each brother brings their own unique
          perspective and talents to our community.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-8 border-b pb-2">
        <button
          className={`font-bold ${
            activeTab === "Actives" ? "text-ktp-appblue border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Actives")}
        >
          Actives
        </button>
        <button
          className={`font-bold ${
            activeTab === "E-Board" ? "text-ktp-appblue border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("E-Board")}
        >
          E-Board
        </button>
        <button
          className={`font-bold ${
            activeTab === "Alumni" ? "text-ktp-appblue border-b-2 border-black" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("Alumni")}
        >
          Alumni
        </button>
      </div>

      {/* Conditional Rendering Based on Active Tab */}
      <div className="mt-6 w-full text-center">
        {activeTab === "Actives" && (
          // Show Brothers grouped and sorted by Custom Order
          <div>
            {brotherName.length === 0 ? (
              <p>Loading brothers...</p>
            ) : (
              Object.entries(groupByClass(brotherName))
                .sort(([classA], [classB]) => {
                  // Sort using the custom order defined in `letters`
                  const indexA = letters.indexOf(classA);
                  const indexB = letters.indexOf(classB);
                  return indexA - indexB;
                })
                .map(([className, brothers]) => (
                  <div key={className} className="mb-12">
                    {/* Class Section Header */}
                    <h2 className="text-xl text-black items-center text-center font-semibold mb-12 underline decoration-2 underline-offset-4">
                      {className === "Co-founder" ? "Founding" : className} Class
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-5 mx-auto max-w-7xl text-gray-700">
                      {brothers.map((brother, index) => (
                        <li
                          key={`${brother.id}-${index}`}
                          className="flex flex-col items-center justify-between text-center space-y-2 "
                        >
                          {/* Profile Image and linkedIn */}
                          <a
                            href={errorHandlingLinkedIn(brother.LinkedIn)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-56 h-56 group"
                          >
                            <div className="duration-300 group-hover:-translate-y-2">
                              <img
                                src={brother.WebsitePhotoURL ?? fallbackImage}
                                alt={`${brother.FirstName ?? "Unknown"} ${brother.LastName ?? "Brother"}`}
                                className="w-56 h-56 object-cover object-top rounded-md transition-transform duration-300 group-hover:shadow-lg"
                              />
                              {/* LinkedIn Icon - Appears on Hover */}
                              <div className="w-56 h-56 absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 text-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Icons.Linkedin />
                              </div>
                            </div>
                            
                          </a>
                          <span className="text-lg font-bebasneue font-semibold">
                            {brother.FirstName} {brother.LastName}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
            )}
          </div>
        )}
        {activeTab === "E-Board" && (
            // Show E-Board Members
            <div className="mt-6">
            {/* Header */}
            <h2 className="text-xl items-center text-center font-semibold mb-12 underline decoration-2 underline-offset-4">
              Kappa Theta Pi Executive Board
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-5 mx-auto max-w-6xl text-gray-700">
              {eboardName.length > 0 ? (
              [...eboardName] // Create a shallow copy to avoid mutating state
                .sort((a, b) => {
                const aIsCoPresident = a.Eboard_Position === "Co-President";
                const bIsCoPresident = b.Eboard_Position === "Co-President";
                if (aIsCoPresident && !bIsCoPresident) return -1; // a comes first
                if (!aIsCoPresident && bIsCoPresident) return 1;  // b comes first
                return 0; // maintain original order for others
                })
                .map((member, index) => (
                <li
                  key={`${member.id}-${index}`}
                  className="flex flex-col items-center justify-between text-center space-y-0.2"
                >
                  {/* Profile Image and linkedIn */}
                  <a
                  href={errorHandlingLinkedIn(member.LinkedIn)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-56 h-56 group"
                  >
                  <div className="duration-300 group-hover:-translate-y-2">
                    <img
                    src={member.WebsitePhotoURL ?? fallbackImage}
                    alt={`${member.FirstName ?? "Unknown"} ${member.LastName ?? "Member"}`}
                    className="w-56 h-56 object-cover object-top rounded-md transition-transform duration-300 group-hover:shadow-lg"
                    />
                    {/* LinkedIn Icon - Appears on Hover */}
                    <div className="w-56 h-56 absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 text-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Icons.Linkedin />
                    </div>
                  </div>
                  </a>
                  <span className="text-lg font-bebasneue font-semibold">
                  {member.FirstName} {member.LastName}
                  </span>
                  {/* Display E-Board Position */}
                  <span className="text-sm text-gray-500">{member.Eboard_Position}</span>
                </li>
                ))
              ) : (
              <p className="text-center">Loading e-board members...</p>
              )}
            </ul>
            </div>
        )}
        {activeTab === "Alumni" && (
          <div className="mt-10">
            <h2 className="text-xl text-center font-semibold mb-12 underline decoration-2 underline-offset-4">
              Kappa Theta Pi Alumni
            </h2>

            {alumniName.length > 0 ? (
              (() => {
                // 1. Greek Letter Mapping (The "Dynamic Logo")
                // FIX: Added Record<string, string> type definition
                const greekMap: Record<string, string> = {
                  "Co-founder": "★", // Star for founders
                  "Alpha": "Α", "Beta": "Β", "Gamma": "Γ", "Delta": "Δ", "Epsilon": "Ε", 
                  "Zeta": "Ζ", "Eta": "Η", "Theta": "Θ", "Iota": "Ι", "Kappa": "Κ", 
                  "Lambda": "Λ", "Mu": "Μ", "Nu": "Ν", "Xi": "Ξ", "Omicron": "Ο", 
                  "Pi": "Π", "Rho": "Ρ", "Sigma": "Σ", "Tau": "Τ", "Upsilon": "Υ", 
                  "Phi": "Φ", "Chi": "Χ", "Psi": "Ψ", "Omega": "Ω"
                };

                const classOrder = [
                  "Co-founder", "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", 
                  "Eta", "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", 
                  "Omicron", "Pi", "Rho", "Sigma", "Tau", "Upsilon", "Phi", "Chi", 
                  "Psi", "Omega"
                ];

                // 2. Group Alumni
                // FIX: Added <Record<string, User[]>> generic to reduce
                const groupedAlumni = alumniName.reduce<Record<string, User[]>>((acc, alumnus) => {
                  const group = alumnus.Class || "Unknown";
                  if (!acc[group]) acc[group] = [];
                  acc[group].push(alumnus);
                  return acc;
                }, {});

                // 3. Sort Classes
                const sortedClassNames = Object.keys(groupedAlumni).sort((a, b) => {
                  const indexA = classOrder.indexOf(a);
                  const indexB = classOrder.indexOf(b);
                  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                  if (indexA !== -1) return -1;
                  if (indexB !== -1) return 1;
                  return a.localeCompare(b);
                });

                return sortedClassNames.map((className) => (
                  <div key={className} className="flex flex-col md:flex-row mb-16 border-b border-gray-100 pb-10 last:border-0">
                    
                    {/* LEFT SIDE: Class Name + Dynamic Greek Letter */}
                    <div className="md:w-1/4 mb-4 md:mb-0 flex flex-col items-start pr-8">
                      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                        {className}
                      </h3>
                      {/* This renders the Greek Letter dynamically */}
                      <span className="text-6xl font-serif text-gray-200 mt-2 select-none">
                        {greekMap[className] || className.charAt(0)}
                      </span>
                    </div>

                    {/* RIGHT SIDE: Text List of Names */}
                    <div className="md:w-3/4">
                      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-8">
                        {groupedAlumni[className].map((alumnus, index) => {
                          
                          // Common styles for the name text
                          const nameText = `${alumnus.FirstName} ${alumnus.LastName}`;
                          const baseClasses = "text-gray-700 text-lg transition-colors duration-200";
                      
                          return (
                            <li key={index}>
                              {alumnus.LinkedIn ? (
                                <a
                                  href={alumnus.LinkedIn}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${baseClasses} hover:text-blue-800 no-underline`}
                                >
                                  {nameText}
                                </a>
                              ) : (
                                <span className={baseClasses}>{nameText}</span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ));
              })()
            ) : (
              <p>Loading alumni...</p>
            )}
          </div>
        )}
      </div> {/* Last Div for the brothers/eboard/alumni*/}

      {/* Last Div for the entire page */}
    </div>
  );
}

export default Brothers;
