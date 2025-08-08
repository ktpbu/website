
/* INTRO IMAGES */
import { Link } from "react-router-dom";
import ktp1 from "../img/ktp1.jpeg";
import ktp2 from "../img/ktp2.jpeg";
import paul from "../img/paul_tye.jpeg";
import ryanc from "../img/ryanc.jpeg";
import ryanch from "../img/ryanch.jpeg";
import yana from "../img/yana.jpeg";
import trio from "../img/Brandon Eric and Rohan.jpeg";
import patrick from "../img/Pat 2.jpeg";

/* KTP App IMAGES */
import ImageCarousel from '../components/ImageCarousel'
import people from "../img/App/people.jpeg";
import alerts from "../img/App/alerts.jpeg";
import events from "../img/App/events.jpeg";
import profile from "../img/App/profile.jpeg";
import download from "../img/App/download.jpeg";
import downloadonappstore from "../img/App/Download on App Store.png";
const images = [events, people, alerts, profile, download]

/*President Welcome IMAGES*/
import PresidentialWelcome from '../components/PresidentialWelcome';

/* Network IMAGES */
import network from "../img/Network/Network.png";

function Home() {
  return (
    <div className="min-h-screen">
      {/* Desktop/Tablet Layout */}
      <div className="hidden custom:flex items-center justify-center px-4">
        <div className="hidden custom:flex items-center justify-center px-4">
          <div className="relative w-[800px] h-[800px] md:mr-8 mb-8 md:mb-0">
            {[
              { src: ryanc, alt: "Ryan C", styles: "top-[126px] left-[288px] w-[76px] h-[76px] rounded-[20px]" },
              { src: ktp2, alt: "KTP 2", styles: "top-[390px] left-[500px] w-[240px] h-[166px] rounded-br-[80px]" },
              { src: trio, alt: "Trio", styles: "top-[527px] left-[34px] w-[170px] h-[142px] rounded-bl-[80px]" },
              { src: paul, alt: "Paul & Tye", styles: "top-[92px] left-[30px] w-[220px] h-[220px] rounded-tl-[80px]" },
              { src: ryanch, alt: "Ryan Ch", styles: "top-[370px] left-[140px] w-[114px] h-[114px] rounded-bl-[80px]" },
              { src: patrick, alt: "Patrick", styles: "top-[80px] left-[435px] w-[106px] h-[150px] rounded-tr-[80px]" },
              { src: yana, alt: "Yana", styles: "top-[462px] left-[298px] w-[130px] h-[130px] rounded-br-[80px]" },
              { src: ktp1, alt: "KTP 1", styles: "top-[236px] left-[288px] w-[182px] h-[182px] rounded-tr-[80px]" },
            ].map(({ src, alt, styles }, index) => (
              <div
                key={index}
                className={`absolute ${styles} shape-big overflow-hidden shadow-lg bg-ktp-appblue transition-all`}
              >
                <img
                  src={src}
                  alt={alt}
                  className="object-cover w-full h-full opacity-0 transition-opacity duration-1000"
                  onLoad={(e) => {
                    setTimeout(() => {
                      (e.target as HTMLImageElement).style.opacity = '1';
                    }, index * 200); // Delay increases with index
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-lg text-left">
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-ktp-appblue">
            Kappa Theta Pi
          </h1>
          <p className="text-gray-600 mb-6">
            As the only professional technology fraternity in the nation,
            we strive to shape the future of technology and foster innovation
            through our strong community
          </p>
          <div className="space-x-4">
            <Link to="/rush">
            <button className="bg-transparent text-ktp-appblue border-2 border-ktp-appblue px-6 py-2 rounded hover:bg-ktp-appblue hover:text-white transition duration-300 relative group">
              Join Now <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&#8250;</span>
            </button>

            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="custom:hidden flex flex-col items-center justify-center px-4">
        <div className="max-w-lg text-left pt-8 pb-16">
          <h1 className="text-4xl font-bold mb-4 text-ktp-appblue">
            Kappa Theta Pi
          </h1>
          <p className="text-gray-600 mb-6">
            As the only professional technology fraternity in the nation,
            we strive to shape the future of technology and foster innovation
            through our strong community
          </p>
          <div className="space-x-4">
            <Link to="/rush">
              <button className="bg-ktp-appblue text-white px-6 py-2 rounded hover:bg-gray-800 transition">
                Join Now &#8250;
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* NETWORK SECTION */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-black mb-6 text-ktp-appblue">Our Network</h2>
        
        <img src={network} alt="network" className="mb-10" />
      </section>

      {/* PRESIDENT WELCOME SECTION */}
      <PresidentialWelcome />
      
      {/* KTP APP SECTION */}
      <section className="py-12 px-4">
  <div className="max-w-6xl mx-auto">


    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
      <div>
      <h2 className="text-3xl sm:text-4xl font-black mb-1 text-ktp-appblue">
      Boston Kappa Theta Pi
    </h2>
    <div className="mt-1 text-3xl text-gray-400 font-bold mb-5">
    One-stop shop for everything KTP!
    </div>
      {/* Text Column */}
      <div className="px-4 md:px-0 text-center md:text-left space-y-4">
        <div className="bg-gray-100 p-6 rounded-md">
          <h1 className="text-xl text-ktp-appblue font-bold mb-5">
          This app will help you through our rush process!
          </h1>
          <p className="text-base mb-4 max-w-prose">
            <ul className="list-disc list-inside space-y-2">
              <li className="text-left">Provide a calendar with all our rush events times and locations</li>
              <li className="text-left">Receive important rush updates and announcements</li>
              <li className="text-left">Network with our brothers and E-Board</li>
              <li className="text-left">Build a rush profile and share your interests and goals</li>
            </ul>
            <br />
            Download Today. Rush Kappa Theta Pi.
            <a
            href="https://apps.apple.com/us/app/boston-ktp/id6654894541?platform=iphone"
            target="_blank"
            rel="noopener noreferrer"
            className=" flex justify-center hover:text-gray-300"
            >
            <img src={downloadonappstore} alt="App Store" className="mt-5 h-[50px]" />
            </a>
          </p>

        </div>
      </div>

      </div>

      {/* Carousel Column */}
      <div className="md:w-1/2 flex justify-center">
        <div className="w-full max-w-[250px]">
          <ImageCarousel images={images} />
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  );
}

export default Home;
