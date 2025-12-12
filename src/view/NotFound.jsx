import React, { useEffect } from "react";
import assets from "../assets/assests";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

const NotFound = () => {
  const { isLoggedIn } = useUser()
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-secClr h-screen flex items-center">
      <div className="made-container py-10 md:py-24">
        <div className="flex justify-between items-center flex-col-reverse lg:flex-row gap-y-9">
          {/* Center Content */}
          <div className="w-full text-center">
            {/* Logo */}
            {/* <div className="flex justify-center">
              <img
                src={assets.logopg}
                alt="Logo"
                className="h-60 w-60 object-contain"
              />
            </div> */}

            {/* Heading */}
            <h1 className="md:text-6xl text-4xl font-extrabold mb-4 bg-gradient-to-l from-accClr to-pryClr bg-clip-text text-transparent leading-tight">
              404 - Page Not Found
            </h1>

            {/* Description */}
            <p className="text-sm md:text-lg md:leading-7 leading-5 mt-4 text-black/80">
              Oops! The page you are looking for does not exist or has been moved.
            </p>

            {/* Back to Home Button */}
            <div className="mt-8">
              <Link
                to={isLoggedIn ? "/user/overview" : "https://wellthrixinternational.com"}
                className="px-6 py-3 rounded-md bg-gradient-to-l from-accClr to-pryClr text-white font-semibold hover:opacity-90 transition"
              >
                Back to Home
              </Link>
            </div>

            {/* Note */}
            <p className="mt-4 text-sm text-black/60 italic">
              _ Let’s get you back on track _
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
