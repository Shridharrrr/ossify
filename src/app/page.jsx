"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Instrument_Serif } from "next/font/google";
import { Domine } from "next/font/google";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const domine = Domine({
  subsets: ["latin"],
  weight: "400",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      <BackgroundRippleEffect rows={12} cols={30} cellSize={48} />

      <nav className="bg-transparent backdrop-blur-sm shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="text-center flex justify-center">
              <h2
                className={`text-3xl ${domine.className} text-white font-bold`}
              >
                Oss<span className="text-neutral-400">ify</span>
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/discover")}
                className="bg-black text-white rounded-none px-6 py-2 border-1 border-gray-500 hover:text-yellow-300 hover:-translate-y-1 transition-transform duration-200"
              >
                Star on Github
              </Button>
              <Button
                onClick={() => router.push("/auth")}
                className="bg-white text-black rounded-none px-6 py-2 hover:bg-gray-100 hover:-translate-y-1 transition-transform duration-200"
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
            className={`text-6xl font-bold text-neutral-400 mb-4 ${instrumentSerif.className} text-center`}
          >
            Discover Amazing
            <span className="text-white block text-center">
              Open Source Projects
            </span>
          </h1>

          <p className="text-sm mb-5 max-w-2xl mx-auto text-neutral-400 font-medium leading-5 transition-all duration-300 sm:text-base text-center">
            Find the perfect repositories to contribute to based on your skills,
            interests, and experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={() => router.push("/auth")}
              className="bg-white text-black rounded-none px-8 py-5 hover:bg-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center justify-center"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>

      <section className="max-w-7xl mx-auto flex-col justify-center items-center px-4 sm:px-6 lg:px-8 pt-32 relative z-10">
        <div className="text-center">
          <div
            className="mb-4 mt-2 sm:mt-3 mx-auto lg:mx-0 px-3 py-2 w-fit text-xs sm:text-sm font-medium text-neutral-400 tracking-tight border-[2px] transition-all duration-300"
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
              onClick={() => router.push("/auth")}
              className="bg-white text-black rounded-none px-8 py-5 hover:bg-gray-100 hover:-translate-y-1 transition-transform duration-200 flex items-center justify-center"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-transparent border-t border-gray-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0">
            <div className="text-center sm:text-left w-full sm:w-60 flex justify-center sm:justify-start order-2 sm:order-1">
              <p className="text-neutral-500 text-sm">
                © {new Date().getFullYear()} Ossify. All rights reserved.
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
