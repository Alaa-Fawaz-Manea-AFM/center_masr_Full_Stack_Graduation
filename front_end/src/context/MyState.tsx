"use client";
import { getUserDataAction } from "@/actions/auth";
import { DOMAIN } from "@/utils/constants";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type UserType = {
  id: string;
  email: string;
  name: string;
  imageUrl: string | null;
  role: string;
  phone: string | null;
  followerCounts: number;
  followingCounts: number;
  postCounts: number;
  createdAt: Date;
};

type ValueType = {
  user: UserType | null;

  setUser: Dispatch<SetStateAction<UserType | null>>;
};

const MyContext = createContext<ValueType | null>(null);

export const useUserContext = () => {
  const context = useContext(MyContext);
  if (!context) throw new Error("useUserContext must be used within MyState");
  return context;
};

const MyState = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  // const [dataProfile, setDataProfile] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      // const token = localStorage.getItem("token");
      // const res = await axios.get(`${DOMAIN}auth/me`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const result = await getUserDataAction();
      console.log("====================================");
      console.log("result000", result);
      console.log("====================================");
      if (result.success) {
        setUser(result.user);
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const value: ValueType = {
    user,
    setUser,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyState;
