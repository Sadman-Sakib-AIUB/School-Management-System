import { BookMarked } from "lucide-react";
const SHIFT_BN = { MORNING: "সকাল", DAY: "দিন", EVENING: "বিকাল", NIGHT: "রাত" };
const AssignedSubjectsCard = ({ assignedSubjects }) => {

  // group by class
  const grouped = {};
  (assignedSubjects || []).forEach((as) => {
    const classId = as.class?.id;
    if (!classId) return;
    if (!grouped[classId]) {
      grouped[classId] = { class: as.class, subjects: [] };
    }
    grouped[classId].subjects.push(as);
  });

  if (!Object.keys(grouped).length) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(grouped).map(({ class: cls, subjects }) => (
          <div key={cls.id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            {/* class header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-gray-800">{cls.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">শিক্ষাবর্ষ: {cls.academicYear}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                {subjects.length} বিষয়
              </span>
            </div>

            {/* sections */}
            {cls.sections?.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-3">
                {cls.sections.map((sec) => (
                  <span key={sec.id} className="text-xs font-semibold px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full">
                    সেকশন {sec.name}
                    {sec.shift && ` · ${SHIFT_BN[sec.shift] || sec.shift}`}
                    {sec._count?.enrollments > 0 && ` · ${sec._count.enrollments} শিক্ষার্থী`}
                  </span>
                ))}
              </div>
            )}

            {/* subject list */}
            <div className="space-y-1.5">
              {subjects.map((as) => (
                <div key={as.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">{as.subject?.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{as.subject?.code}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs text-gray-500">
                      {as.totalMarks} নম্বর
                    </p>
                    <p className="text-xs text-gray-400">
                      পাস: {as.passingMarks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default AssignedSubjectsCard;