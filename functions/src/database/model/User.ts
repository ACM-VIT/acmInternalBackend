import Project from "./Project";

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
  projects?: Array<Project>;
  accounts_connected?: Record<string, string>;
  discord_username?:string;
  pwd?:string;
}

export const USER_COLLECTION_NAME = "Users";
