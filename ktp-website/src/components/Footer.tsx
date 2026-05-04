import Icons from "./Icons";
import downloadonappstore from "../img/App/Download on App Store.png";
import BeepBop from "../img/BeepBop.png";

function Footer() {
    const menuItems = [
        {
            title: "Home",
            path: "/",
        },
        {
            title: "About",
            path: "/about",
        },
        {
            title: "Brothers",
            path: "/brothers",
        },
        {
            title: "Rush",
            path: "/rush",
        },
        {
            title: "Contact",
            path: "/contact",
        },
    ];
    const iconItems = [
        { link: "https://facebook.com/ktpbostonu", icon: <Icons.Facebook /> },
        { link: "https://instagram.com/ktpbostonu", icon: <Icons.Instagram /> },
        {
            link: "https://www.linkedin.com/company/kappa-theta-pi-lambda-chapter/",
            icon: <Icons.Linkedin />,
        },
        {
            link: "https://github.com/ktpbu",
            icon: <Icons.GitHub />,
        },
    ];
    return (
        <footer className="bg-ktp-appblue text-white py-8 relative">
            <div className="container max-w-4/5 md:max-w-[1000px] mx-auto flex flex-wrap justify-around">
                {/* Menu Section */}
                <div className="m-4">
                    <h3 className="font-bold text-lg mb-4">Menu</h3>
                    <ul className="flex flex-col flex-wrap justify-between">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <a href={item.path} className="hover:underline">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Follow Us Section */}
                <div className="m-4">
                    <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                    <div className="max-w-24 sm:max-w-none sm:space-x-4 flex flex-wrap justify-around">
                        {iconItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 sm:w-fit mb-4 hover:text-gray-300"
                            >
                                {item.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* App Section */}
                <div className="m-4">
                    <h3 className="font-bold text-lg text-center mb-4">
                        Boston KTP App
                    </h3>
                    <div className="flex justify-center">
                        <a
                            href="https://apps.apple.com/us/app/boston-ktp/id6654894541?platform=iphone"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-300"
                        >
                            <img
                                src={downloadonappstore}
                                alt="App Store"
                                className="h-12"
                            />
                        </a>
                    </div>
                </div>
            </div>
             {/*Beep bop*/}
             <div className="absolute top-10 right-5 m-3 hidden md:block">
                <img
                    src={BeepBop}
                    alt="Beep"
                    className="h-[100px] w-[100px] transform rotate-[10deg]"
                />
            </div>

            <div className="w-fit mx-auto mt-4 flex flex-col text-center">
                <p>Developed and maintained by Lambda Chapter</p>
                <p>© Kappa Theta Pi 2025. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
