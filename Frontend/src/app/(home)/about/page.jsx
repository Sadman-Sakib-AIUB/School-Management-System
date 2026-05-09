"use client"
import React, { useRef } from "react";
import AboutHero from "../../components/home/about/AboutHero";
import AboutSchool from "../../components/home/about/AboutSchool";
import MissionVision from "../../components/home/about/MissionVision";
import PrincipalMessage from "../../components/home/PrincipalMessage";
import CoreValues from "../../components/home/about/CoreValues";
import AboutCTA from "../../components/home/about/AboutCTA";

const About = () => {
  const aboutRef = useRef(null);
  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" }); //
  };
  return (
    <main className="bg-white pt-30">
      {/* -------------------- Hero Section -------------------- */}
      <AboutHero onLearnMoreClick={scrollToAbout} />

      {/* -------------------- About School -------------------- */}
      <div ref={aboutRef}>
        <AboutSchool />
      </div>

      {/* -------------------- Mission & Vision -------------------- */}
      <MissionVision />

      {/* -------------------- Head Teacher Message -------------------- */}
      <PrincipalMessage />

      {/* -------------------- Core Values -------------------- */}
      <CoreValues />
      {/* -------------------- CTA -------------------- */}
      <AboutCTA />
    </main>
  );
};

export default About;
