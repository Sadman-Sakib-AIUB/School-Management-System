"use client"
import React from 'react';
import FacultyDirectory from '../../components/home/FacultyDirectory';
import TeachersTestimonials from '../../components/home/TeachersTestimonials';
const teacher= () =>{
    
    return (
        <div className =' py-60'>
            <TeachersTestimonials></TeachersTestimonials>
        <FacultyDirectory></FacultyDirectory>
       </div>
       

    )

}

export default teacher;
