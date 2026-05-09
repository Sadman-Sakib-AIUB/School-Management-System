import React from 'react';
import { notices } from '../../../data/mockData';
import { notFound } from 'next/navigation';
import { NotepadText } from 'lucide-react';
import Breadcrumb from '../../../components/Breadcrumb';




const Notice = async ({params}) => {

  const {id} = await params;
  // console.log(params);
  // console.log(id);

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_URL}/notices/${id}`,
  //   { cache: "no-store" } // or 'force-cache' if static
  // );

  // if (!res.ok) {
  //   throw new Error("Failed to fetch notice");
  // }

  // const notice = await res.json();
  // console.log(notice);

  const notice = notices.find((n) => n.id === parseInt(id));
  if (!notice) notFound();
  // console.log(notice);

  
  
  return (
     <div className="min-h-screen container mx-auto px-4 pt-36 max-w-4xl">

      <h1 className='text-4xl text-primary-700 font-bold mb-5'><span><NotepadText className='inline-block size-8 mr-2' /></span>নোটিশ</h1>

      <Breadcrumb></Breadcrumb>

      {/* Notice Content */}
      <article className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
            {notice.category}
          </span>

          {notice.isImportant && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-sm">
              জরুরী
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          {notice.title}
        </h1>

        <p className="text-slate-500 text-sm mb-6">
          প্রকাশিত: {notice.date}
        </p>

        <div className="prose max-w-none text-slate-700">
          <p>{notice.id}</p>
        </div>
      </article>
    </div>
  );
};

export default Notice;