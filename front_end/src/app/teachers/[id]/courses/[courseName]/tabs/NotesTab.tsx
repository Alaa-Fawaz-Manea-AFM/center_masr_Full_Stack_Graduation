"use client";
import { DataActions } from "@/actions/users";
import { formatDate } from "@/app/components/helper";
import { FileText, Lock, Download, FolderOpen } from "lucide-react";
import { useEffect } from "react";

const NotesTab = ({ cache, setCache, courseId, searchQuery, mode }: any) => {
  const data = cache[mode] || [];

  const handleGetLessons = async () => {
    if (cache[mode]?.length > 0) return;
    const result = await DataActions("get", `${mode}?id=${courseId}`);
    if (!result.success) {
      return;
    }
    setCache((pre) => {
      return {
        ...pre,
        [mode]: result.data || [],
      };
    });
  };
  useEffect(() => {
    handleGetLessons();
  }, []);

  const filtered = data?.filter((n) => n.title.includes(searchQuery));
  return (
    <div className="divide-y divide-[#F8FAFC]">
      {filtered.map((note: any, i: number) => (
        <div
          data-aos="zoom-in"
          key={note.id}
          className="p-8 flex flex-col md:flex-row items-center justify-between"
        >
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-[#9CA3AF] text-[10px] font-bold mb-1 uppercase">
                حصة
              </p>
              <p className="text-[32px] font-black text-[#9CA3AF] leading-none">
                {++i}
              </p>
            </div>
            <div
              className={`p-5 rounded-2xl ${
                note.isLocked
                  ? "bg-[#F4F4F4] border-transparent text-[#231F20]"
                  : "bg-[#F4F4F4] text-[#000000]"
              }`}
            >
              {note.isLocked ? <Lock size={28} /> : <FileText size={28} />}
            </div>
            <div className="text-right">
              <h3 className="text-sm md:text-lg font-bold text-[#191C1D] mb-2">
                {note.title}
              </h3>
              <p className="text-[#94A3B8] text-xs font-bold tracking-wide">
                {mode === "exams"
                  ? formatDate(note.duration)
                  : formatDate(note.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {note.isLocked ? (
              <span className="text-[#94A3B8] font-bold text-sm ml-4 mt-3 md:mt-0">
                احجز الحصة لفتح{" "}
                {mode == "notes"
                  ? "المذكرة"
                  : mode == "homeWorks"
                    ? "الواجب"
                    : "الامتحان"}
              </span>
            ) : (
              <div className="flex gap-4">
                <button className="p-3 text-[#94A3B8] hover:text-[#1E293B] transition-colors bg-[#F8FAFC] rounded-lg border border-[#F1F5F9] cursor-pointer">
                  <FolderOpen size={20} />
                </button>
                {mode == "exams" ? (
                  ""
                ) : (
                  <button className="p-3 text-[#94A3B8] hover:text-[#1E293B] transition-colors bg-[#F8FAFC] rounded-lg border border-[#F1F5F9] cursor-pointer">
                    <Download size={20} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesTab;
