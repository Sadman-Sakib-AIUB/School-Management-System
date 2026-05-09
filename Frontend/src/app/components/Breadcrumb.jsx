"use client";
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Breadcrumb = () => {
  const pathname = usePathname();
  
  // Split path and remove empty strings
  const pathSegments = pathname.split('/').filter((segment) => segment !== "");

  // Map English URL segments to Bengali labels
  const labelMap = {
    students: "শিক্ষার্থী",
    statistics: "পরিসংখ্যান",
    notice: "নোটিশ",
  };

  return (
    <nav className="flex items-center text-sm text-slate-500 gap-2 mb-4">
      <Link href="/" className="hover:text-primary-600">হোম</Link>
      
      {pathSegments.map((segment, index) => {
        // Build the URL for this specific segment
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const label = labelMap[segment] || segment; // Use map or fallback to raw segment
        // console.log(label);
        // console.log(isLast);
        // console.log(href);

        return (
          <React.Fragment key={href}>
            <ChevronRight size={16} />
            {isLast ? (
              <span className="text-slate-700 font-medium truncate">{label}</span>
            ) : (
              <Link href={href} className="hover:text-primary-600 capitalize">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
