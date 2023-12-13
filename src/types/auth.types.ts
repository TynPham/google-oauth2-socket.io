import { ResponseData } from "./index";
export type AuthResponse = ResponseData<{
  access_token: string;
  refresh_token: string;
}>;
