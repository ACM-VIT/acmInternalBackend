export enum ProjectStatus {
  IDEATION = "ideation",
  REVIEW = "review",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}
export default interface Project {
  name: string;
  desc?: string;
  wanted?: Array<string>;
  resources?: Record<string, string>;
  status: ProjectStatus;
  teamMembers?: Array<string>;
}

export const PROJECT_COLLECTION_NAME = "Projects";
