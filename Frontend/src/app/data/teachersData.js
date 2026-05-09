
// src/data/teachersData.js

 export const testimonials = [
  {
    id: 1,
    name: "জাহিদুর রহমান",
    designation: "প্রধান শিক্ষক",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    quote: "শিক্ষা আপনাকে জীবনে এগিয়ে নিয়ে যাওয়ার সবচেয়ে বড় হাতিয়ার। আমরা প্রতিটি শিক্ষার্থীকে তাদের সম্পূর্ণ সম্ভাবনা উপলব্ধি করতে সাহায্য করি। আমাদের লক্ষ্য শুধু পরীক্ষায় ভালো ফলাফল নয়, বরং সুনাগরিক তৈরি করা।",
    advice: "প্রিয় শিক্ষার্থীরা, জ্ঞান অর্জন করুন এবং নিয়মিত অনুশীলন করুন। সফলতা আসবেই। প্রতিটি দিন নতুন কিছু শেখার চেষ্টা করুন এবং আপনার লক্ষ্যের দিকে এগিয়ে যান। মনে রাখবেন, কঠোর পরিশ্রম কখনো বৃথা যায় না।"
  },
  {
    id: 2,
    name: "সোনিয়া রহমান",
    designation: "গণিত বিভাগের প্রধান",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    quote: "আমাদের স্কুলের প্রতিটি শিক্ষার্থী আমাদের কাছে বিশেষ। আমরা তাদের স্বপ্ন পূরণে সহায়তা করি এবং তাদের সাথে প্রতিটি পদক্ষেপে থাকি। শিক্ষা শুধু বই পড়া নয়, এটি জীবন গড়ার প্রক্রিয়া।",
    advice: "গণিত ভয়ের বিষয় নয়, এটি মজার! নিয়মিত অনুশীলন করলে আপনি যেকোনো কঠিন সমস্যা সমাধান করতে পারবেন। আত্মবিশ্বাসী থাকুন এবং প্রশ্ন করতে ভয় পাবেন না। প্রতিটি ভুল থেকে শিখুন।"
  },
  {
    id: 3,
    name: "ড. কামরুল ইসলাম",
    designation: "বিজ্ঞান বিভাগের প্রধান",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    quote: "বিজ্ঞান শিক্ষা শুধু তত্ত্ব নয়, এটি বাস্তব জীবনে প্রয়োগের মাধ্যম। আমরা শিক্ষার্থীদের পরীক্ষা ও গবেষণার মাধ্যমে শেখাই। প্রতিটি শিশুর মধ্যে একজন বিজ্ঞানী লুকিয়ে আছে।",
    advice: "কৌতূহলী হোন, প্রশ্ন করুন এবং পরীক্ষা করুন। বিজ্ঞান হলো পর্যবেক্ষণ ও অনুসন্ধান। প্রকৃতিকে ভালোবাসুন এবং তার রহস্য উন্মোচন করুন।"
  }
];

export const faculty = [
  {
    id: 1,
    name: "আবদুল্লাহ আল নোমান",
    designation: "সিনিয়র বাংলা শিক্ষক",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    phone: "+880 1712-345678",
    email: "abdullah@xyzschool.edu.bd",
    coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=400&fit=crop",
    department: "বাংলা বিভাগ",
    experience: 12,
    rating: 4.8,
    totalReviews: 124,
    totalStudents: 850,
    bio: "আবদুল্লাহ আল নোমান একজন অভিজ্ঞ এবং নিবেদিত বাংলা শিক্ষক। তিনি ১২ বছরেরও বেশি সময় ধরে শিক্ষকতা করছেন এবং শিক্ষার্থীদের মধ্যে বাংলা ভাষা ও সাহিত্যের প্রতি গভীর আগ্রহ তৈরি করতে সফল হয়েছেন।",
    subjects: ["বাংলা সাহিত্য", "বাংলা ব্যাকরণ", "রচনা ও প্রবন্ধ", "কবিতা বিশ্লেষণ"],
    education: [
      { degree: "এম.এ (বাংলা সাহিত্য)", institution: "ঢাকা বিশ্ববিদ্যালয়", year: 2010 },
      { degree: "বি.এ (সম্মান)", institution: "ঢাকা বিশ্ববিদ্যালয়", year: 2008 },
    ],
    achievements: ["সেরা শিক্ষক পুরস্কার ২০২২", "জাতীয় শিক্ষা সপ্তাহে বিশেষ সম্মাননা", "১০০+ শিক্ষার্থী SSC তে A+"],
    schedule: [
      { day: "রবিবার", time: "৮:০০ - ১০:০০ AM", class: "ক্লাস ৯" },
      { day: "সোমবার", time: "১০:০০ - ১২:০০ PM", class: "ক্লাস ১০" },
      { day: "বুধবার", time: "৮:০০ - ১০:০০ AM", class: "ক্লাস ৮" },
    ],
    socialMedia: { facebook: "#", linkedin: "#" },
    reviews: [
      { id: 1, name: "রাহেলা খানম", rating: 5, comment: "অসাধারণ শিক্ষক! পড়ানোর ধরন খুবই সহজবোধ্য।", date: "১৫ জানুয়ারি ২০২৪" },
      { id: 2, name: "তানভীর আহমেদ", rating: 5, comment: "স্যারের কাছে শিখে বাংলা সহজ হয়ে গেছে।", date: "৮ ফেব্রুয়ারি ২০২৪" },
    ],
  },
    {
    id: 2,
    name: "মাহবুব সরকার",
    designation: "সিনিয়র ইংরেজি শিক্ষক",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    phone: "+880 1812-345678",
    email: "mahbub@xyzschool.edu.bd",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=400&fit=crop",
    department: "ইংরেজি বিভাগ",
    experience: 15,
    rating: 4.9,
    totalReviews: 189,
    totalStudents: 1200,
    bio: "মাহবুব সরকার একজন অভিজ্ঞ ইংরেজি শিক্ষক যিনি ১৫ বছরেরও বেশি সময় ধরে শিক্ষাক্ষেত্রে কর্মরত।",
    subjects: ["English Grammar", "English Literature", "Spoken English", "Writing Skills"],
    education: [
      { degree: "M.A (English Literature)", institution: "Dhaka University", year: 2007 },
      { degree: "B.A (Honours)", institution: "Dhaka University", year: 2005 },
    ],
    achievements: ["Best Teacher Award 2021 & 2023", "Cambridge English Certified Trainer"],
    schedule: [
      { day: "রবিবার", time: "১০:০০ - ১২:০০ PM", class: "ক্লাস ১০" },
      { day: "মঙ্গলবার", time: "৮:০০ - ১০:০০ AM", class: "ক্লাস ৯" },
    ],
    socialMedia: { facebook: "#", linkedin: "#" },
    reviews: [
      { id: 1, name: "আরিফ হোসেন", rating: 5, comment: "স্যারের কাছে পড়ে ইংরেজিতে ভয় কেটে গেছে।", date: "২০ জানুয়ারি ২০২৪" },
    ],
  },

 {
    id: 3,
    name: "সোনিয়া আক্তার",
    designation: "সিনিয়র রসায়ন শিক্ষক",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    phone: "+880 1912-345678",
    email: "sonia@xyzschool.edu.bd",
    coverImage: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=1200&h=400&auto=format&fit=crop",
    department: "বিজ্ঞান বিভাগ",
    experience: 10,
    rating: 4.7,
    totalReviews: 98,
    totalStudents: 620,
    bio: "সোনিয়া আক্তার একজন উৎসাহী রসায়ন শিক্ষক।",
    subjects: ["জৈব রসায়ন", "অজৈব রসায়ন", "ভৌত রসায়ন"],
    education: [
      { degree: "এম.এস.সি (রসায়ন)", institution: "বুয়েট", year: 2013 },
    ],
    achievements: ["সেরা নারী শিক্ষক পুরস্কার ২০২৩"],
    schedule: [
      { day: "সোমবার", time: "৮:০০ - ১০:০০ AM", class: "ক্লাস ১১" },
    ],
    socialMedia: { facebook: "#", linkedin: "#" },
    reviews: [
      { id: 1, name: "রিফাত হাসান", rating: 5, comment: "ম্যামের কাছে রসায়ন পড়া অনেক মজার।", date: "১ ফেব্রুয়ারি ২০২৪" },
    ],
  },

  {
    id: 4,
    name: "তাসনিম জারা শাওন",
    designation: "সিনিয়র পদার্থবিজ্ঞান শিক্ষক",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    phone: "+880 1612-345678",
    email: "tasnim@xyzschool.edu.bd",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&h=400&auto=format&fit=crop",
    department: "বিজ্ঞান বিভাগ",
    experience: 8,
    rating: 4.9,
    totalReviews: 112,
    totalStudents: 740,
    bio: "তাসনিম জারা শাওন পদার্থবিজ্ঞানের জটিল বিষয়গুলোকে শিক্ষার্থীদের কাছে সহজভাবে উপস্থাপনে পারদর্শী। তিনি আধুনিক টিচিং মেথডোলজি ব্যবহার করেন।",
    subjects: ["বলবিজ্ঞান", "তাপগতিবিদ্যা", "স্থির তড়িৎ", "আধুনিক পদার্থবিজ্ঞান"],
    education: [
      { degree: "এম.এস.সি (পদার্থবিজ্ঞান)", institution: "রাজশাহী বিশ্ববিদ্যালয়", year: 2015 },
      { degree: "বি.এস.সি (সম্মান)", institution: "রাজশাহী বিশ্ববিদ্যালয়", year: 2013 },
    ],
    achievements: ["উদ্ভাবনী শিক্ষক অ্যাওয়ার্ড ২০২৪", "বিজ্ঞান মেলা মেন্টর পুরস্কার"],
    socialMedia: { facebook: "#", linkedin: "#" },
  },
  {
    id: 5,
    name: "রফিকুল ইসলাম",
    designation: "সিনিয়র গণিত শিক্ষক",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    phone: "+880 1712-987654",
    email: "rafiq@xyzschool.edu.bd",
    coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=400&fit=crop",
    department: "গণিত বিভাগ",
    experience: 18,
    rating: 5.0,
    totalReviews: 245,
    totalStudents: 1500,
    bio: "রফিকুল ইসলাম দীর্ঘ ১৮ বছর ধরে গণিত নিয়ে কাজ করছেন। তার হাত ধরে হাজারো শিক্ষার্থী উচ্চতর গণিতে অসাধারণ ফলাফল অর্জন করেছে।",
    subjects: ["বীজগণিত", "জ্যামিতি", "ত্রিকোণমিতি", "ক্যালকুলাস"],
    education: [
      { degree: "এম.এস.সি (ফলিত গণিত)", institution: "ঢাকা বিশ্ববিদ্যালয়", year: 2004 },
    ],
    achievements: ["আজীবন সম্মাননা শিক্ষকতা পুরস্কার", "গণিত অলিম্পিয়াড প্রশিক্ষক"],
    socialMedia: { facebook: "#", linkedin: "#" },
  },
  {
    id: 6,
    name: "নাজমা বেগম",
    designation: "সিনিয়র ইতিহাস শিক্ষক",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop",
    phone: "+880 1812-987654",
    email: "nazma@xyzschool.edu.bd",
    coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&h=400&fit=crop",
    department: "মানবিক বিভাগ",
    experience: 20,
    rating: 4.6,
    totalReviews: 87,
    totalStudents: 980,
    bio: "নাজমা বেগম ইতিহাস ও বিশ্ব সভ্যতার একজন প্রাজ্ঞ শিক্ষক। তার গল্প বলার ঢঙে ইতিহাস পাঠ শিক্ষার্থীদের কাছে অত্যন্ত জনপ্রিয়।",
    subjects: ["প্রাচীন ইতিহাস", "মুক্তিযুদ্ধের ইতিহাস", "বিশ্ব সভ্যতা"],
    education: [
      { degree: "এম.এ (ইতিহাস)", institution: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়", year: 2002 },
    ],
    socialMedia: { facebook: "#", linkedin: "#" },
  },
  {
    id: 7,
    name: "সাইফুল ইসলাম",
    designation: "সিনিয়র ভূগোল শিক্ষক",
    image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop",
    phone: "+880 1912-987654",
    email: "saiful@xyzschool.edu.bd",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop",
    department: "মানবিক বিভাগ",
    experience: 7,
    rating: 4.5,
    totalReviews: 56,
    totalStudents: 430,
    bio: "সাইফুল ইসলাম মানচিত্র এবং ভূ-তত্ত্ব বিশেষজ্ঞ। প্র্যাকটিকাল ক্লাসের মাধ্যমে তিনি পরিবেশ ও ভূগোলের পাঠ দান করেন।",
    subjects: ["আঞ্চলিক ভূগোল", "মানচিত্রাঙ্কন", "পরিবেশ বিজ্ঞান"],
    education: [
      { degree: "বি.এস.সি (সম্মান), এম.এস.সি", institution: "চট্টগ্রাম বিশ্ববিদ্যালয়", year: 2016 },
    ],
    socialMedia: { facebook: "#", linkedin: "#" },
  },
  {
    id: 8,
    name: "ফাতিমা খানম",
    designation: "সিনিয়র জীববিজ্ঞান শিক্ষক",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    phone: "+880 1612-987654",
    email: "fatima@xyzschool.edu.bd",
    coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200&h=400&auto=format&fit=crop",
    department: "বিজ্ঞান বিভাগ",
    experience: 11,
    rating: 4.8,
    totalReviews: 132,
    totalStudents: 890,
    bio: "ফাতিমা খানম উদ্ভিদ ও প্রাণিবিদ্যার গবেষণাধর্মী পাঠদানে বিশ্বাসী। তার শিক্ষার্থীরা নিয়মিত মেডিকেল ভর্তি পরীক্ষায় সাফল্য অর্জন করে।",
    subjects: ["উদ্ভিদবিজ্ঞান", "প্রাণিবিজ্ঞান", "কোষ রসায়ন", "জেনেটিক্স"],
    education: [
      { degree: "এম.এস.সি (উদ্ভিদবিজ্ঞান)", institution: "ঢাকা বিশ্ববিদ্যালয়", year: 2011 },
    ],
    achievements: ["শ্রেষ্ঠ শিক্ষক (স্কুল শাখা) ২০২১"],
    socialMedia: { facebook: "#", linkedin: "#" },
  }
];
export function getTeacherById(id) {
  return faculty.find((t) => t.id === Number(id));
}

const teacherData = { faculty, testimonials };
export default teacherData;
