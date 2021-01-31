import  { ProjectStatus } from "./Project";

export interface ProjectBrief {
  name:string,
  status:ProjectStatus,
  id?:string
}
export default interface User {
  id?:string,
  full_name: string;
  email: string;
  profilePic?:string;
  verified?:boolean,
  department?: string;
  description?: string;
  roles?:Array<string> ;
  personal_profiles?: Record<string, string>;
  projects?: any;
  accounts_connected?: Record<string, string>;
  discord_username?:string;
  pwd?:string;
}

export const USER_COLLECTION_NAME = "Users";
