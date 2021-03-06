import { Request } from 'express';
import User from '../database/model/User';
import Keystore from '../database/model/KeyStore';

// declare interface PublicRequest extends Request {
//   apiKey: string;
// }

declare interface RoleRequest extends Request<any>{
  currentRoleCode?: string;
}

declare interface ProtectedRequest extends RoleRequest {
  user?: User;
  accessToken?: string;
  keystore?: Keystore;
}

declare interface GoogleRequest extends Request {
  googleId?:string
  accessToken?:string,
  user?:any;
}
declare interface DiscordRequest extends Request {
  accessToken?:string,
  discordToken?:string,
  discordUser?:string,
  user?:any;
}

declare interface Tokens {
  accessToken: string;
  refreshToken: string;
}
