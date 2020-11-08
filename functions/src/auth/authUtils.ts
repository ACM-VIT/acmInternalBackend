import { Tokens } from '../types/app-request';
import { AuthFailureError, InternalError } from '../core/ApiError';
import JWT, { JwtPayload } from '../core/JWT';
import { tokenInfo } from '../config';

export const getAccessToken = (authorization: string) => {
  if (!authorization) throw new AuthFailureError('Invalid Authorization');
  if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid Authorization');
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
    throw new AuthFailureError('Invalid Access Token');
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
