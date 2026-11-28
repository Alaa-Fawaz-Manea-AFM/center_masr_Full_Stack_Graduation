"use client";
import { DataActions } from "@/actions/users";
import { TeacherTyep } from "@/types/teacher";
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
  teacher: TeacherTyep;
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
  useEffect(() => {
    const fetchUser = async () => {
      const result = await DataActions("get", "auth/me");
      if (result.success) {
        setUser(result.data.user);
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
