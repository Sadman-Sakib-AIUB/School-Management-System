import React from 'react';
import ClientWrapper from '../components/ClientWrapper';
import Footer from '../components/home/Footer';

const layout = ({children}) => {
  return (
    <div>
      {/* This is Navbar and topbar inside ClientWrapper */}
        <ClientWrapper/> 
      <div>
      {children}
      </div>
      <footer>
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default layout;