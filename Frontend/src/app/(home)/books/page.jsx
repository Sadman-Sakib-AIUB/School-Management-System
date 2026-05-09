"use client";

import React, { useMemo, useState } from "react";
import { BookOpen, Download, Eye, X, Search, Filter } from "lucide-react";
import BookHeader from "../../components/home/book/BookHeader";
import BookFilter from "../../components/home/book/BookFilter";
import BookCard from "../../components/home/book/BookCard";
import PreviewModal from "../../components/PreviewModal";

/* ---------------- Demo Book Data ---------------- */
const BOOKS = [
  {
    id: 1,
    class: "নবম শ্রেণি",
    subject: "বাংলা",
    name: "বাংলা সাহিত্য",
    board: "NCTB",
    link: "https://drive.google.com/file/d/1yjdxHcyFeQLBKLD8tykuqGABh_CaCXIn/view",
  },
  {
    id: 2,
    class: "নবম শ্রেণি",
    subject: "গণিত",
    name: "সাধারণ গণিত",
    board: "English Version",
    link: "https://drive.google.com/file/d/1AYg7uY_WjVYJmoskhb0-D58iFPvgwmpJ/view",
  },
  {
    id: 3,
    class: "দশম শ্রেণি",
    subject: "পদার্থবিজ্ঞান",
    name: "Physics",
    board: "NCTB",
    link: "https://drive.google.com/file/d/1PCiSEy9n4euVypxciw2-HVyaJvuF4H9t/view",
  },
  {
    id: 4,
    class: "অষ্টম শ্রেণি",
    subject: "ইংরেজি",
    name: "English For Today",
    board: "NCTB",
    link: "https://drive.google.com/file/d/1AYg7uY_WjVYJmoskhb0-D58iFPvgwmpJ/view",
  },
  {
    id: 5,
    class: "পঞ্চম শ্রেণি",
    subject: "বাংলাদেশ ও বিশ্বপরিচয়",
    name: "বাংলাদেশ ও বিশ্বপরিচয়",
    board: "NCTB",
    link: "https://drive.google.com/file/d/1AYg7uY_WjVYJmoskhb0-D58iFPvgwmpJ/view",
  },
];

const Books = () => {
  const [selectedClass, setSelectedClass] = useState("শ্রেণি");
  const [selectedBoard, setSelectedBoard] = useState("বোর্ড");
  const [search, setSearch] = useState("");
  const [previewBook, setPreviewBook] = useState(null);

  const classes = ["শ্রেণি", ...new Set(BOOKS.map((b) => b.class))];
  const boards = ["বোর্ড", "NCTB", "English Version"];

  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      const matchClass =
        selectedClass === "শ্রেণি" || book.class === selectedClass;
      const matchBoard =
        selectedBoard === "বোর্ড" || book.board === selectedBoard;
      const matchSearch =
        book.name.toLowerCase().includes(search.toLowerCase()) ||
        book.subject.toLowerCase().includes(search.toLowerCase());
      return matchClass && matchBoard && matchSearch;
    });
  }, [selectedClass, selectedBoard, search]);

  return (
    <main className="bg-[#F8FAFC] min-h-screen font-sans selection:bg-primary-100 selection:text-primary-700 pt-5">
      {/* ---------------- Header + title ---------------- */}

      <BookHeader />

      {/* ---------------- Filter Card ---------------- */}

      <BookFilter
        classes={classes}
        boards={boards}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        search={search}
        setSearch={setSearch}
      />

      {/* ---------------- Book Cards ---------------- */}
      <section className="py-16">
        <div className="container mx-auto  px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onPreview={() => setPreviewBook(book)}
            />
          ))}

          {filteredBooks.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="bg-slate-100 inline-flex p-6 rounded-full mb-4">
                <BookOpen size={40} className="text-slate-300" />
              </div>
              <p className="text-slate-500 text-lg italic font-medium">
                দুঃখিত, কোনো বই খুঁজে পাওয়া যায়নি।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- Modern Modal ---------------- */}
      {/* {previewBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={()=>setPreviewBook(null)}
              />
              <div className="bg-white rounded-3xl w-full max-w-6xl h-[85vh] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="absolute top-4 right-4 z-50 flex gap-2">
                   <button
                    onClick={()=>setPreviewBook(null)}
                    className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-800 hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
                  >
                    <X size={24} />
                  </button>
                </div>
        
                <iframe
                  src={previewBook.link.replace("/view", "/preview")}
                  title="PDF Preview"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
      )} */}

      <PreviewModal
        isOpen={!!previewBook}
        book={previewBook}
        onClose={() => setPreviewBook(null)}
      />


    </main>
  );
};

export default Books;
