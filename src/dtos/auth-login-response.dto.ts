import { User } from "src/user/user.model";

export interface AuthLoginResponseDTO {
  userResponse: User,
  access_token: string;
}