export interface AuthResponse {
  status: string;
  message: string;
  data: UserData;
  token: Tokens;
}

export interface Iform {
  name: string | undefined;
  email: string;
  password: string;
  terms: boolean | undefined;
  role?: "teacher" | "center" | "student";
}

export interface UserData {
  id: string;
  name: string;
  imageUrl: string | null;
  role: "student" | "teacher" | "center";
  profileId: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
