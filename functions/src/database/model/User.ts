import Project from "./Project";

export default interface User {
  full_name: string;
  email: string;
  department: string;
  description?: string;
  role?: string;
  personal_profiles?: Record<string, string>;
  projects?: Array<Project>;
  accounts_connected?: Record<string, string>;
}

export const USER_COLLECTION_NAME = "Users";
