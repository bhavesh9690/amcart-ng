export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  roles: string[];
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobile: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface ConfirmSignUpRequest {
  email: string;
  code: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  exp: number;
}
