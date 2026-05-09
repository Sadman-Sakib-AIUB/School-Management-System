import { Bell, BookOpen, Calendar, ClipboardList, GraduationCap, LayoutDashboard, MapPinHouse, Medal, Settings, UserPen, Users, UserSquare2 } from "lucide-react";

export const siteInfo = {
  schoolName: "আদর্শ উচ্চ বিদ্যালয় ও কলেজ",
  eiin: "১২২৩৩৪",
  schoolCode: "৫৬৭৮",
  regNo: "৯৮৭৬৫৪৩২১",
  address: "ফ্ল্যাট-৭, বাসা: ১০৮৯, এভিনিউ-৮, রোড-৬ডি, মিরপুর ডিওএইচএস, ঢাকা, বাংলাদেশ।",
  phone: "+৮৮০ ২ ৯৮৭৬৫৪৩",
  email: "info@aparsschool.edu.bd",
  established: "১৯৯৫",
  mission: "শিক্ষার মাধ্যমে আদর্শ মানুষ গঠন আমাদের মূল লক্ষ্য।",
  vision: "তথ্য প্রযুক্তিনির্ভর আধুনিক ও নৈতিক শিক্ষাদান।",
};

export const notices = [
  { id: 1, title: "২০২৬ শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু", date: "১০ মে, ২০২৫", category: "ভর্তি", isImportant: true },
  { id: 2, title: "অর্ধ-বার্ষিক পরীক্ষার রুটিন প্রকাশ", date: "০৫ মে, ২০২৫", category: "পরীক্ষা"},
  { id: 3, title: "বৌদ্ধ পূর্ণিমা উপলক্ষে স্কুল ছুটি", date: "০২ মে, ২০২৫", category: "ছুটি" },
  { id: 4, title: "এসএসসি পরীক্ষার ফলাফল ২০২৫", date: "২৮ এপ্রিল, ২০২৫", category: "ফলাফল" },
  { id: 5, title: "বার্ষিক ক্রীড়া প্রতিযোগিতা স্থগিত", date: "২০ এপ্রিল, ২০২৫", category: "সাধারণ" },
];

export const teachers = [
  { id: 1, name: "মো: আব্দুল হাই", designation: "প্রধান শিক্ষক", subject: "গণিত", image: "https://picsum.photos/seed/t1/400/400" },
  { id: 2, name: "ফাতেমা বেগম", designation: "সহকারী প্রধান শিক্ষক", subject: "ইংরেজি", image: "https://picsum.photos/seed/t2/400/400" },
  { id: 3, name: "ড. মশিউর রহমান", designation: "সিনিয়র শিক্ষক", subject: "পদার্থবিজ্ঞান", image: "https://picsum.photos/seed/t3/400/400" },
  { id: 4, name: "নুসরাত জাহান", designation: "সহকারী শিক্ষক", subject: "বাংলা", image: "https://picsum.photos/seed/t4/400/400" },
];

export const stats = [
  { label: "মোট শিক্ষার্থী", value: "১২৫০+", icon: Users },
  { label: "দক্ষ শিক্ষক", value: "৪৫+", icon: UserPen },
  { label: "পাশের হার", value: "৯৮%", icon: Medal },
  { label: "প্রতিষ্ঠার সাল", value: "১৯৯৫", icon: MapPinHouse },
];

export const gallery = [
  { id: 1, url: "https://plus.unsplash.com/premium_photo-1681842268180-1e6233379943?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "বার্ষিক ক্রীড়া অনুষ্ঠান", category: "অনুষ্ঠান" },
  { id: 2, url: "https://images.unsplash.com/photo-1661260100649-7e994335cdb9?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "বিজ্ঞান মেলা", category: "শিক্ষামূলক" },
  { id: 3, url: "https://images.unsplash.com/photo-1599943821034-8cb5c7526922?q=80&w=1059&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "পুরস্কার বিতরণী", category: "অনুষ্ঠান" },
  { id: 4, url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "ক্লাসরুম অ্যাক্টিভিটি", category: "ক্যাম্পাস" },
];


export const demoData = [
  {
    class: "Nine",
    shift: "Morning",
    section: "A",
    department: "Science",
    male: 20,
    female: 20,
    muslim: 15,
    hindu: 5,
    buddhist: 0,
    christian: 0,
    disabled: 0,
  },
  {
    class: "Nine",
    shift: "Morning",
    section: "B",
    department: "Science",
    male: 18,
    female: 22,
    muslim: 20,
    hindu: 15,
    buddhist: 3,
    christian: 2,
    disabled: 1,
  },
  {
    class: "Ten",
    shift: "Day",
    section: "A",
    department: "Arts",
    male: 16,
    female: 24,
    muslim: 30,
    hindu: 8,
    buddhist: 1,
    christian: 1,
    disabled: 0,
  },
];


export const MENU_ITEMS = [
  { id: 'overview', label: 'ওভারভিউ', icon: <LayoutDashboard size={20} /> },
  { id: 'students', label: 'শিক্ষার্থী ব্যবস্থাপনা', icon: <Users size={20} /> },
  { id: 'teachers', label: 'শিক্ষক তালিকা', icon: <UserSquare2 size={20} /> },
  { id: 'academic', label: 'একাডেমিক', icon: <BookOpen size={20} /> },
  { id: 'attendance', label: 'উপস্থিতি', icon: <ClipboardList size={20} /> },
  { id: 'exam', label: 'পরীক্ষা ও ফলাফল', icon: <GraduationCap size={20} /> },
  { id: 'notices', label: 'নোটিশ বোর্ড', icon: <Bell size={20} /> },
  { id: 'routine', label: 'ক্লাস রুটিন', icon: <Calendar size={20} /> },
  { id: 'settings', label: 'সেটিংস', icon: <Settings size={20} /> },
];

export const educationBoards = [
  { name: "ঢাকা বোর্ড", url: "https://dhakaeducationboard.gov.bd", code: "DHAKA" },
  { name: "রাজশাহী বোর্ড", url: "https://rajshahieducationboard.gov.bd", code: "RAJSHAHI" },
  { name: "কুমিল্লা বোর্ড", url: "https://comillaeducationboard.gov.bd", code: "COMILLA" },
  { name: "যশোর বোর্ড", url: "https://jessoreeducationboard.gov.bd", code: "JESSORE" },
  { name: "চট্টগ্রাম বোর্ড", url: "https://web.bise-ctg.gov.bd", code: "CHITTAGONG" },
  { name: "বরিশাল বোর্ড", url: "https://barisalboard.gov.bd", code: "BARISAL" },
  { name: "সিলেট বোর্ড", url: "https://sylhetboard.gov.bd", code: "SYLHET" },
  { name: "দিনাজপুর বোর্ড", url: "https://dinajpureducationboard.gov.bd", code: "DINAJPUR" },
  { name: "ময়মনসিংহ বোর্ড", url: "https://mymensingheducationboard.gov.bd", code: "MYMENSINGH" },
  { name: "মাদ্রাসা বোর্ড", url: "https://bmeb.gov.bd", code: "MADRASAH" },
  { name: "কারিগরি বোর্ড", url: "http://bteb.gov.bd", code: "TECHNICAL" },
];