"use client"
import React from 'react';
import Hero from '../components/home/Hero';
import NoticeBoard from '../components/home/NoticeBoard';
import Stats from '../components/home/Stats';
import PrincipalMessage from '../components/home/PrincipalMessage';

import TeachersTestimonials from '../components/home/TeachersTestimonials';

import SchoolGallery from '../components/SchoolGallery';
import Contact from '../components/home/Contact';

const page = () => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-600 selection:text-white">
      
      <main className="flex-1 pt-30">
        
        <Hero />
        <NoticeBoard />
        <Stats />
        <PrincipalMessage></PrincipalMessage>

        <SchoolGallery></SchoolGallery>
        
        <h1 className=" py-6 text-center">Next part here</h1>

      </main>
      

    </div>
  );
};

export default page;