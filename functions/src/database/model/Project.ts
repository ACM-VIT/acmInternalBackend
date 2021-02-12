import User from "./User";

export enum ProjectStatus {
  IDEATION = "ideation",
  REVIEW = "review",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}
export default interface Project {
  id?: string;
  name: string;
  desc?: string;
  tags?: string[];
  image?: string;
  wanted?: Array<string>;
  resources?: Record<string, string>;
  status: ProjectStatus;
  teamMembers?: Array<string>; //only names of teamMemebrs
  teamMembersProfilePic?: Array<string>;
  teamMembersId?: Array<string>;
  founder?: User
  icon?: string;
}

export const PROJECT_COLLECTION_NAME = "Projects";
