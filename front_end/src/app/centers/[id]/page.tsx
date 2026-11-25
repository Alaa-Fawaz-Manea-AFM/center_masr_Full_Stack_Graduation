"use client";

import { useEffect, useState } from "react";
import { ProfileFeed } from "@/src/app/components/profile/ProfileFeed";
import { ProfileHeader } from "@/src/app/components/profile/ProfileHeader";
import { ProfileTabs } from "@/src/app/components/profile/ProfileTabs";
import { ProfileSidebar } from "@/src/app/components/profile/ProfileSidebar";
import TeachersTab from "@/src/app/components/profile/TeachersTab";
import ScheduleTab from "@/src/app/components/profile/ScheduleTab";
import LocationTab from "@/src/app/components/profile/LocationTap";
import { DOMAIN } from "@/src/utils/constants";
import { useParams } from "next/navigation";
import CenterProfileSkeleton from "@/src/app/components/profile/CenterProfileSkeleton";

export default function CenterProfilePage() {
  const param = useParams() as { id: string };
  const [centerData, setCenterData] = useState({});
  const [cachePosts, setCachePosts] = useState({
    meta: {},
    data: [],
  });
  const [cache, setCache] = useState({
    students: [],
    reviews: [],
    weeks: [],
  });
  const [activeTab, setActiveTab] = useState("الرئيسية");

  const renderTabContent = () => {
    switch (activeTab) {
      case "الرئيسية":
        return (
          <ProfileFeed
            userName={centerData?.name}
            userImage={centerData?.imageUrl}
            role="center"
            userId={centerData?.id}
            setCachePosts={setCachePosts}
            cachePosts={cachePosts || []}
          />
        );
      case "المدرسين":
        return (
          <TeachersTab
            centerId={centerData?.center?.id}
            cache={cache?.students || []}
            setsetCache={setCache}
          />
        );
      case "جدول الحصص":
        return (
          <ScheduleTab
            centerId={centerData?.center?.id}
            setCache={setCache}
            cashWeeks={cache.weeks || []}
          />
        );
      case "الموقع الجغرافي":
        return (
          <LocationTab
            governorate={centerData?.center?.governorate || ""}
            location={centerData?.center?.location || ""}
          />
        );
      default:
        return (
          <ProfileFeed
            userName={centerData?.name}
            userImage={centerData?.imageUrl}
            role="center"
            userId={centerData?.id}
            setCash={setCash}
            cashPosts={cash.posts || []}
          />
        );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getData = async () => {
      const res = await fetch(`${DOMAIN}users/${param.id}?role=center`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setCenterData(json.data);
    };

    if (param) getData();
  }, [param]);

  if (!centerData?.id) {
    return <CenterProfileSkeleton />;
  }
  return (
    <main className="bg-[#F3F4F6] min-h-screen pb-20" dir="rtl">
      <ProfileHeader data={centerData} />

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {activeTab === "الرئيسية" && (
            <div className="lg:col-span-4 space-y-6">
              <ProfileSidebar data={centerData} />
            </div>
          )}

          <div
            className={`${
              activeTab === "الرئيسية" ? "lg:col-span-8" : "lg:col-span-12"
            }`}
          >
            <div className="space-y-6">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
