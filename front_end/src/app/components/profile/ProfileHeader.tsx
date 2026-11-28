"use client";
import { UserData } from "@/types/dashboard";
import Image from "next/image";
import { useEffect, useState } from "react";
import ButtonFollow from "../button/ButtonFollow";
import ButtonSendChat from "../button/ButtonSendChat";

export const ProfileHeader = ({ data }: any) => {
  const [dataHeader, setDataHeader] = useState<UserData>(data);
  return (
    <div className="relative bg-white shadow-sm pb-6">
      <div className="relative h-48 md:h-72 overflow-hidden">
        {dataHeader?.imageUrl && (
          <Image
            src={dataHeader?.imageUrl}
            alt={dataHeader?.name}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20">
          <div data-aos="zoom-in" className="relative group">
            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-4 border-white bg-white shadow-md overflow-hidden z-20"></div>
          </div>

          <div
            data-aos="zoom-in"
            className="flex-1 text-center md:text-right pb-2"
          >
            <div className="flex flex-col md:flex-row items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-[#2E637C]">
                {dataHeader?.name}
              </h1>
            </div>

            <p className="text-[#2E637C] text-xl">
              {dataHeader?.followerCounts} متابع
            </p>
          </div>

          <div data-aos="zoom-in" className="flex gap-2 pb-2">
            <ButtonFollow
              id={dataHeader?.id}
              data={dataHeader}
              setData={setDataHeader}
            />
            <ButtonSendChat id={dataHeader?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
