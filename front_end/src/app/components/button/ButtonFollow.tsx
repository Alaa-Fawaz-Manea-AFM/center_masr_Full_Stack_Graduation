"use client";
import { DataActions } from "@/actions/users";
import { useUserContext } from "@/context/MyState";
import { UserCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ButtonFollow = ({
  data,
  setData,
  id,
}: {
  data: any;
  id: any;
  setData: any;
}) => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;
    if (user === null) return toast.error("يرجى تسجيل الدخول أولاً");
    setLoading(true);
    const result = await DataActions("post", `followers/${id}`);
    if (!result.success) {
      toast.error("حدث خطأ ما");
      setLoading(false);
      return;
    }
    const isNowFollowed = result?.data?.isFollowed || false;
    setData((prev: any) => ({
      ...prev,
      isFollowed: isNowFollowed,
      followerCounts: isNowFollowed
        ? prev?.followerCounts + 1
        : prev?.followerCounts - 1,
    }));

    toast.success(isNowFollowed ? "تمت المتابعة" : "تم إلغاء المتابعة");
    setLoading(false);
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 ${
        data.isFollowed
          ? "bg-white text-[#2E637C] border border-[#2E637C]"
          : "bg-[#2E637C] text-white hover:bg-[#215167]"
      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {data.isFollowed ? (
        <>
          <UserCheck size={18} />
          <span>Following</span>
        </>
      ) : (
        <>
          <UserPlus size={18} />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};

export default ButtonFollow;
