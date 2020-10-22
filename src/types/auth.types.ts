export interface AuthTokenClaims {
  alg: string;
  aud?: string;
  exp: string;
  iat: string;
  iss?: string;
  sub: string;
  typ: string;
  zip: string;
}
