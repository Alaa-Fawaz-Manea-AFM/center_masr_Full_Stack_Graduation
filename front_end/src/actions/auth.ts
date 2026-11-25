"use server";

import { AxiosServer } from "@/lib/axios-server";
import { AuthFormData } from "@/lib/validation";
import { Iform } from "@/types/auth";
// import { AxiosServer } from "@/lib/axios-server";
// import { IFormSign_up, IFormLog_In } from "@/types";
import { AxiosResponse } from "axios";
import { cookies } from "next/headers";

export const loginAndSignUpAction = async (endpoint: string, form: Iform) => {
  try {
    const response = await AxiosServer("post", endpoint, undefined, form);
    // console.log("====================================");
    // console.log("response", response);
    // console.log("====================================");
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

// export const signUpAction = async (form: any) => {
//   try {
//     const response = await AxiosServer("post", "auth/signup", undefined, form);
//     await saveAuthCookies(response);
//     return {
//       success: true,
//       data: response.data.data || null,
//     };
//   } catch {
//     return {
//       success: false,
//       data: null,
//     };
//   }
// };

const saveAuthCookies = async (response: AxiosResponse) => {
  const cookieStore = await cookies();

  response.headers["set-cookie"]?.forEach((cookie: string) => {
    const [pair] = cookie.split(";");
    const [name, ...value] = pair.split("=");

    if (["accessToken"].includes(name)) {
      cookieStore.set(name, value.join("="), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
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

export const updateProfileAction = async (
  userId: string,
  updatedData: Partial<any>,
) => {
  try {
    const { data } = await AxiosServer(
      "patch",
      `users/${userId}`,
      undefined,
      updatedData,
    );

    return {
      success: true,
      message: data.message || "Profile Updated successfully",
    };
  } catch {
    return {
      success: false,
      message: "Error updating profile",
    };
  }
};

export const getUserDataAction = async () => {
  try {
    const { data } = await AxiosServer("get", "auth/me");

    return {
      success: true,
      user: data?.data || null,
    };
  } catch {
    return {
      success: false,
      user: null,
    };
  }
};
