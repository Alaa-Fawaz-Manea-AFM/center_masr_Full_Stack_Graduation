"use client";

import { DataActions } from "@/actions/users";
import { useUserContext } from "@/context/MyState";
import { Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const ButtonLikes = ({ isLiked: liked, likesCount, id }: any) => {
  const { user } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [likesCounts, setLikesCounts] = useState(likesCount);
  const [isLiked, setIsLiked] = useState(liked);

  const handleLike = async () => {
    if (loading) return;
    if (user === null) return toast.error("يرجى تسجيل الدخول أولاً");
    setLoading(true);
    const result = await DataActions("post", `likes/${id}`);
    if (!result.success) {
      toast.error("حدث خطأ ما");
      setLoading(false);
      return;
    }
    const isNowLiked = result.data?.isLiked || false;
    setIsLiked(isNowLiked);
    setLikesCounts((prev: number) => (isNowLiked ? prev + 1 : prev - 1));
    toast.success(isNowLiked ? "تم تسجيل الإعجاب" : "تم إزالة الإعجاب");
    setLoading(false);
  };

  return (
    <button onClick={handleLike} disabled={loading}>
      <div
        className={`flex items-center gap-2 transition-colors ${
          isLiked ? "text-red-500" : "text-slate-400 hover:text-red-500"
        }`}
      >
        <span className="text-[11px] font-black">{likesCounts}</span>

        <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
      </div>
    </button>
  );
};

export default ButtonLikes;
