"use client"
import React, { useState, useEffect, useRef } from 'react';
import useOpenRouter from '../chat/_components/hook/useOpenRouter';
import ReactMarkdown from 'react-markdown';


const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [myContext, setMyContext] = useState("আমারা 'ASG SHOP'। আমরা বাংলাদেশের শিক্ষার্থীদের জন্য একটি অনলাইন শিক্ষা প্ল্যাটফর্ম।");
  const { messages, sendMessage, isLoading } = useOpenRouter();
  const scrollRef = useRef(null);

  
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      sendMessage(input, myContext);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-gray-50">
      <header className="py-4 border-b border-gray-200 mb-4">
        <h1 className="text-xl font-semibold text-gray-800">ASG Assistant</h1>
        <p className="text-sm text-gray-500">Your personal AI assistant</p>
      </header>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto pt-2 my-4 space-y-4 pr-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
              msg.role === 'user' 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
            }`}>
              {/* {msg.content || (isLoading && index === messages.length - 1 ? "..." : "")} */}
              {/* used ReactMarkdown */}
              <div className="prose prose-sm sm:prose max-w-none">
                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>
              </div>

              {msg.content === '' && isLoading && index === messages.length - 1 && (
                <span className="animate-pulse">Thinking...</span>
              )}


            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-4 pr-16 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute right-4 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;