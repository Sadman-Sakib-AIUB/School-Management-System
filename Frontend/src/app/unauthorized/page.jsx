"use client";
import React from 'react';
import Link from 'next/link';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">অ্যাক্সেস অনুমোদিত নয় (403)</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        দুঃখিত, এই পেজটি দেখার জন্য প্রয়োজনীয় অনুমতি বা রোল (Role) আপনার নেই।
        দয়া করে আপনার অ্যাডমিনিস্ট্রেটরের সাথে যোগাযোগ করুন।
      </p>

      <div className="space-x-4">
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          ড্যাশবোর্ডে ফিরে যান
        </Link>

        <button
          onClick={() => window.history.back()}
          className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100"
        >
          পিছনে ফিরে যান
        </button>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
