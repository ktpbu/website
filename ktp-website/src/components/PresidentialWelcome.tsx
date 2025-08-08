import React from 'react';
import president from '../img/RChengWelcome.jpeg'; // Adjust the path as needed

const PresidentialWelcome = () => {
  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-stretch gap-8">
        {/* Image on the left */}
        <img
          src={president}
          alt="Presidential Welcome"
          className="w-full max-w-sm md:max-w-md lg:max-w-lg h-auto max-h-[530px] rounded-lg shadow-lg object-contain"
        />

        {/* Text on the right */}
        <div className="text-center md:text-left">
          <h2 className="text-center text-3xl sm:text-4xl font-black text-ktp-appblue mb-4">
            Presidential Welcome
          </h2>

          <div>
            <p className="mb-4 hover:scale-[1.02] transition-all duration-200 ease-in-out">
              On behalf of the Lambda Chapter of Kappa Theta Pi, I’d like to extend a warm welcome to our official website. Whether you're a prospective member, a potential patron, or simply curious to learn more about our organization, you'll find everything you need here to better understand who we are and what we stand for.
            </p>

            <p className="mb-4 hover:scale-[1.02] transition-all duration-200 ease-in-out">
              Founded in 2012, Kappa Theta Pi serves as the only co-ed professional technology fraternity in the nation. As one of the fastest growing chapters with brothers from all majors, we pride ourselves in the individuality of each brother which strengthens our collective identity. Our five core values: Professional Development, Alumni Connections, Social Growth, Technological Advancement, and Academic Support, guide how we operate and support each other from within the chapter and beyond.
            </p>

            <p className="mb-4 hover:scale-[1.02] transition-all duration-200 ease-in-out">
              I’ve had the privilege of being in Kappa Theta Pi for a majority of my college career and it has been, without a doubt, one of the best decisions I’ve made since stepping foot on campus. From the unforgettable experiences to the incredible people, this fraternity has given me more than I could have ever imagined. For that, I am deeply grateful.
            </p>

            <p className="mb-4 hover:scale-[1.02] transition-all duration-200 ease-in-out">
              I highly encourage you to explore our website, learn more about us, and reach out if you have any questions. Feel free to contact us at <a href="mailto:ktpbostonu@gmail.com" className="text-blue-600 underline hover:text-blue-800">ktpbostonu@gmail.com</a> or find us on Instagram
              <a
                href="https://www.instagram.com/ktpbostonu/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline hover:text-blue-800 ml-1"
              >
                @ktpbostonu
              </a>. If you are an incoming rushee, I look forward to meeting you during recruitment.
            </p>

            <p className="mb-1">Best Regards,</p>
            <p className="mb-1">Ryan Cheng</p>
            <p className="mb-1 italic text-gray-700">President of Kappa Theta Pi Lambda Chapter</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresidentialWelcome;