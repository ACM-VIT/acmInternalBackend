import { Tokens } from '../types/app-request';
import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { GooglePayload, JwtPayload } from '../core/JWT';
import { tokenInfo } from '../config';

export const getAccessToken = (authorization: string) => {
  if (!authorization) throw new AuthFailureError('Invalid Authorization: Key must be present in req header with correct spelling');
  if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization: Include the Bearer prefix space the accesstoken');
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience
  )
    throw new AuthFailureError('Invalid Access Token : Token Data');
  return true;
};




export const validateGoogleTokenData = (payload: GooglePayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.email ||
    payload.iss !== "https://securetoken.google.com" ||
    payload.aud !== "acminternal"
  )
    throw new AuthFailureError('Invalid Google Access Token : Token Data');
  return true;
};

export const createTokens = async (
  user_id: string,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<Tokens> => {
  const accessToken = await JWT.encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user_id,
      accessTokenKey,
      tokenInfo.accessTokenValidityDays,
    ),
  );

  if (!accessToken) throw new InternalError();

  const refreshToken = await JWT.encode(
    new JwtPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user_id,
      refreshTokenKey,
      tokenInfo.refreshTokenValidityDays,
    ),
  );

  if (!refreshToken) throw new InternalError();

  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  } as Tokens;
};
