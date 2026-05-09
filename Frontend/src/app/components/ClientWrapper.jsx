"use client"
import React, { useEffect, useState } from 'react';
import TopBar from './home/TopBar';
import Navbar from './home/Navbar';

const TOPBAR_HEIGHT = 36;

const ClientWrapper = ({ children }) => {

  const [isTopbarHidden, setIsTopbarHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      // hide topbar when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > TOPBAR_HEIGHT) {
        setIsTopbarHidden(true);
      }
      // show topbar when scrolling up
      else {
        setIsTopbarHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  return (
    <>
    <header className='fixed top-0 left-0 w-full z-50'>
      <TopBar isHidden={isTopbarHidden} />
      <Navbar isScrolled={isScrolled} />
    </header>
    </>
    
  );
};

export default ClientWrapper;