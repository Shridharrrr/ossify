"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { Instrument_Serif, Domine, Electrolize } from "next/font/google";
import { useAuth } from "@/context/AuthContext";
import { useState} from "react";

const domine = Domine({
  subsets: ["latin"],
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const electrolize = Electrolize({
  subsets: ["latin"],
  weight: "400",
});

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleOnclick = async () => {
    setIsLoading(true);
    setError("");

  try {
    if (user) {
      router.push("/discover");
    } else {
      router.push("/auth"); 
    }
  } catch (e) {
    setError(e.message || "Something went wrong"); 
  } finally {
    setIsLoading(false);
  }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              style={{ color: '#52525b' }}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              style={{ color: '#ffffff' }}
            />
          </svg>
        </div>
        <p className="text-neutral-400 text-sm">Just Calm Down</p>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <BackgroundRippleEffect rows={12} cols={30} cellSize={48} />

      <nav className="bg-transparent backdrop-blur-sm shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="text-center flex justify-center">
              <h2
                className={`text-2xl lg:text-3xl ${domine.className} text-white font-bold`}
              >
                Oss<span className="text-neutral-400">ify</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.open("https://github.com/Shridharrrr/ossify", "_blank")}
                className={`group cursor-pointer active:scale-95 relative flex items-center justify-center gap-2 w-fit bg-black text-white rounded-none px-6 py-2 border border-neutral-700 hover:text-yellow-300 hover:-translate-y-1 transition-all duration-700 ease-out overflow-hidden ${electrolize.className}`}
              >
                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-0"></div>

                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-700/0 to-transparent group-hover:from-neutral-800/30 group-hover:via-neutral-700/40 group-hover:to-transparent transition-all duration-700 ease-out pointer-events-none z-0"></div>

                <div className="flex items-center gap-1.5 z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white/40 group-hover:text-yellow-300 transition duration-300"
                    aria-hidden="true"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                  </svg>
                  <span className="tracking-tight transition group-hover:text-white">
                    Star on Github
                  </span>
                </div>
              </Button>
              <Button
                onClick={handleOnclick}
                className="bg-white text-black rounded-none px-6 py-2 cursor-pointer hover:bg-gray-100 hover:-translate-y-1 active:scale-95 transition-transform duration-200"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto flex-col justify-center items-center px-4 sm:px-6 lg:px-8 mt-36 relative z-10">
        <div className="text-center">
          <h1
            className={`lg:text-6xl text-5xl font-bold text-neutral-400 mb-4 ${instrumentSerif.className} text-center`}
          >
            Discover Amazing
            <span className="text-white block text-center">
              Open Source Projects
            </span>
          </h1>

          <p className=" mb-5 lg:max-w-2xl max-w-sm mx-auto text-neutral-400 font-medium leading-5 transition-all duration-300 text-base text-center">
            Find the perfect repositories to contribute to based on your skills,
            interests, and experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={handleOnclick}
              className="bg-white cursor-pointer active:scale-95 text-black rounded-none px-8 py-5 hover:bg-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center justify-center"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        <div className="text-center">
          <div
            className="mb-4 mt-2 sm:mt-3 mx-auto lg:mx-0 px-3 py-2 w-fit text-sm font-medium text-neutral-400 tracking-tight border-[2px] transition-all duration-300"
            style={{
              borderImage:
                "conic-gradient(#d4d4d4 0deg, #171717 90deg, #d4d4d4 180deg, #171717 270deg, #d4d4d4 360deg) 1",
            }}
            role="banner"
            aria-label="Project tagline"
          >
            Join hundreds of developers using ossify today
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={handleOnclick}
              className="bg-white cursor-pointer active:scale-95 text-black rounded-none px-8 py-5 hover:bg-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center justify-center"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-transparent border-t border-gray-800 py-6 lg:py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-5 ">
            <div className="text-center sm:text-left w-full sm:w-60 flex justify-center sm:justify-start order-2 sm:order-1">
              <p className={`text-neutral-500 text-sm ${electrolize.className}`}>
                ©{new Date().getFullYear()} Ossify. All rights reserved.
              </p>
            </div>

            <div className="text-center flex justify-center order-1 sm:order-2">
              <h2
                className={`text-2xl ${domine.className} text-white font-bold`}
              >
                Oss<span className="text-neutral-400">ify</span>
              </h2>
            </div>

            <div className="flex space-x-6 w-full sm:w-60 justify-center sm:justify-end order-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-200"
              >
                <Github size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-200"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors duration-200"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="mailto:hello@ossify.com"
                className="text-neutral-400 hover:text-white transition-colors duration-200"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
