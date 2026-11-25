"use server";

import { AxiosServer } from "@/lib/axios-server";

// import { AxiosServer } from "@/lib/axios-server";

// export const createPostAction = async (body: Record<string, unknown>) => {
//   try {
//     await AxiosServer("post", "posts", undefined, body);
//     return { success: true };
//   } catch {
//     return { success: false };
//   }
// };

// export const updatePostAction = async (
//   postId: string,
//   body: Record<string, unknown>,
// ) => {
//   try {
//     await AxiosServer("patch", `posts/${postId}`, undefined, body);
//     return { success: true };
//   } catch {
//     return { success: false };
//   }
// };

// export const removePostAction = async (postId: string) => {
//   try {
//     await AxiosServer("delete", `posts/${postId}`);

//     return {
//       success: true,
//       message: "Post deleted",
//     };
//   } catch {
//     return {
//       success: false,
//       message: "Failed to delete post, please try again.",
//     };
//   }
// };

export const getDataAction = async (
  method: "get" | "post" | "delete" | "patch" | "put",
  endPoint: string,
  query?: Record<string, unknown>,
  data?: unknown,
) => {
  try {
    const res = await AxiosServer(method, endPoint, query, data);

    return {
      success: true,
      data: res.data?.data,
      message: res.data.message,
    };
  } catch {
    return {
      success: false,
      data: null,
      message: "Something With Wrong",
    };
  }
};

export const getTeacherAction = async (centerId: string) => {
  try {
    const { data } = await AxiosServer(
      "get",
      `center-dashboard/teachers/${centerId}?limit=9`,
    );

    return {
      success: true,
      data: data?.data,
    };
  } catch {
    return {
      success: false,
      data: null,
      message: "Failed to load Teachers",
    };
  }
};

export const getUserPostsAction = async (
  userId: string,
  role: string,
  page: string | number,
) => {
  try {
    const { data } = await AxiosServer(
      "get",
      `posts?userId=${userId}&role=${role}&page=${page}`,
    );

    return {
      success: true,
      data: data?.data,
    };
  } catch {
    return {
      success: false,
      data: null,
      message: "Failed to load user " + role,
    };
  }
};

export const getUsersDataAction = async (id: string, role: string) => {
  try {
    const { data } = await AxiosServer("get", `users/${id}?role=${role}`);

    return {
      success: true,
      data: data?.data,
    };
  } catch {
    return {
      success: false,
      data: null,
      message: "Failed to load user " + role,
    };
  }
};
