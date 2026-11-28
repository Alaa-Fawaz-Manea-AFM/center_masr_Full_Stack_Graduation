"use server";

import { AxiosServer } from "@/lib/axios-server";
import { Iform } from "@/types/auth";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";

export const loginAndSignUpAction = async (endpoint: string, form: Iform) => {
  try {
    const response = await AxiosServer("post", endpoint, undefined, form);
    await saveAuthCookies(response);
    return {
      success: true,
      data: response.data.data || null,
      message: "تمت العملية بنجاح",
    };
  } catch {
    return {
      success: false,
      data: null,
      message: "فشل الاتصال بالسيرفر",
    };
  }
};

const saveAuthCookies = async (response: AxiosResponse) => {
  const cookieStore = await cookies();

  response.headers["set-cookie"]?.forEach((cookie: string) => {
    const [pair] = cookie.split(";");
    const [name, ...value] = pair.split("=");

    if (["accessToken"].includes(name)) {
      cookieStore.set(name, value.join("="), {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }
  });
};

export const logoutAction = async () => {
  try {
    await AxiosServer("post", "auth/logout");
  } catch {
    return { success: false };
  }

  const cookieStore = await cookies();

  cookieStore.delete("accessToken");

  return { success: true };
};
