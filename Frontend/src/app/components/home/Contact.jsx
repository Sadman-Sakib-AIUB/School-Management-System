"use client"
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Facebook, Youtube, Twitter } from 'lucide-react';
import { siteInfo } from '../../data/mockData';

const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleWhatsAppSend = (e) => {
    e.preventDefault();

    
    const myWhatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER; 

    // Formatting the message for WhatsApp
    const text = `নতুন বার্তা:\n\n` +
                 `নাম: ${formData.name}\n` +
                 `মোবাইল: ${formData.phone}\n` +
                 `বিষয়: ${formData.subject}\n` +
                 `বার্তা: ${formData.message}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${myWhatsAppNumber}?text=${encodedText}`;
    console.log(whatsappUrl);

    window.open(whatsappUrl, '_blank');
  };


  return (
    <section id="contact" className="py-20 bg-slate-50 text-slate-900 overflow-hidden relative">
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h3 className="text-4xl font-black mb-6 leading-tight text-slate-900">যোগাযোগ করুন</h3>
            <p className="text-slate-600 text-lg mb-12">
              যেকোনো জিজ্ঞাসা বা তথ্যের জন্য আমাদের সাথে যোগাযোগ করতে পারেন। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।
            </p>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shrink-0 border border-primary-100">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">ঠিকানা</h4>
                  <p className="text-slate-600 leading-relaxed">{siteInfo.address}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shrink-0 border border-primary-100">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">ফোন ও মোবাইল</h4>
                  <p className="text-slate-600">{siteInfo.phone}</p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shrink-0 border border-primary-100">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">ইমেইল</h4>
                  <p className="text-slate-600">{siteInfo.email}</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-lg font-bold mb-6 text-slate-700">আমাদের সামাজিক যোগাযোগ</h4>
              <div className="flex gap-4">
                {[Facebook, Youtube, Twitter].map((Icon, idx) => (
                  <button key={idx} className="w-12 h-12 bg-white hover:bg-primary-600 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all shadow-sm border border-slate-200 hover:border-primary-500">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/60">
            <h4 className="text-2xl font-bold mb-8 text-slate-900">সরাসরি ম্যাসেজ পাঠান</h4>
            {/* Form */}
            <form onSubmit={handleWhatsAppSend} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">আপনার নাম</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="নাম লিখুন"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 ml-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                    placeholder="০১৭XXXXXXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">বিষয়</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="বিষয়ের নাম"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">আপনার বার্তা</label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 focus:border-primary-500 focus:bg-white focus:outline-none transition-all"
                  placeholder="বিস্তারিত লিখুন..."
                ></textarea>
              </div>
              <button type='submit' className="bg-primary-600 hover:bg-primary-700 text-white w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.01] shadow-lg shadow-primary-200">
                বার্তা পাঠান <Send size={22} />
              </button>
            </form>
          </div>
        </div>

        
        <div className="mt-20 w-full h-80 bg-slate-200 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-inner">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.4381182072398!2d90.37245540650306!3d23.83857148611252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c100727e7aef%3A0x18b34b3762b0e532!2sASG%20SHOP!5e0!3m2!1sen!2sbd!4v1771135667553!5m2!1sen!2sbd" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
            title="Google Maps"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;

