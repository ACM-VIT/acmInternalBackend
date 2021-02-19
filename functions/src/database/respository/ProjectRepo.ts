import { FirestoreDocRef, firestoreInstance, projectsRef } from "../..";
import Logger from "../../core/Logger";
import Project, { ProjectStatus, PROJECT_COLLECTION_NAME } from "../model/Project";
import User from "../model/User";

const perPage = 15;

export default class ProjectRepo {
  public static async create(project: Project): Promise<FirestoreDocRef> {
    // project.createdAt =new Date();
    project.updatedAt = new Date(new Date().getTime() + 1000)
    const createdProjectRef = await projectsRef.doc();
    createdProjectRef.set(project, { merge: true });
    return createdProjectRef;
  }

  public static async update(id: string, updates: any): Promise<any> {
    updates["updatedAt"] = new Date();
    Logger.info(JSON.stringify(updates,null,2));
    return projectsRef.doc(id).update(updates);
  }

  public static async findByStatus(status: ProjectStatus): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("status", "==", status).orderBy("updatedAt", "desc").get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }
  public static async findByStatusPaginate(status: ProjectStatus, pageNum: number): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("status", "==", status).orderBy("updatedAt", "desc").limit(perPage).offset(perPage * (pageNum - 1)).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async findByStatusAndUser(status: ProjectStatus, user: User): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("teamMembers", "array-contains", user.full_name).where("status", "==", status).orderBy("updatedAt","desc").get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async findByStatusAndUserPaginate(status: ProjectStatus, user: User, pageNum: number): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("teamMembers", "array-contains", user.full_name).where("status", "==", status).orderBy("updatedAt","desc").limit(perPage).offset(perPage * (pageNum - 1)).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }


  public static async findByName(name: string): Promise<Project | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("name", "==", name).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res[0];
  }

  public static async findByTag(tagName: string): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("tags", "array-contains", tagName).orderBy("updatedAt", "desc").get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async findByTagPaginate(tagName: string, pageNum: number): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("tags", "array-contains", tagName).orderBy("updatedAt", "desc").limit(perPage).offset(perPage * (pageNum - 1)).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async findByUser(id: string): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("teamMembersId", "array-contains", id).orderBy("updatedAt", "desc").get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async findByUserPaginate(id: string, pageNum: number): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("teamMembersId", "array-contains", id).orderBy("updatedAt", "desc").limit(perPage).offset(perPage * (pageNum - 1)).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async findByFounder(name: string): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("founder.full_name", "==", name).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async findByFounderPaginate(name: string, pageNum: number): Promise<Project[] | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("founder.full_name", "==", name).orderBy("updatedAt", "desc").limit(perPage).offset(perPage * (pageNum - 1)).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async delete(id: string): Promise<any> {
    const res = await projectsRef.doc(id).delete();
    return res;
  }
  public static async findById(id: string): Promise<Project | undefined> {
    const snapshot = await projectsRef.doc(id).get();
    if (!snapshot.exists) return undefined;
    return { id: snapshot.id, ...snapshot.data() } as Project;
  }

  public static async fetchAll(): Promise<Project[] | undefined> {
    const allProjects = await firestoreInstance
      .collection(PROJECT_COLLECTION_NAME)
      .orderBy("updatedAt", "desc")
      .get();
    if (allProjects.empty) return undefined;
    const res: any = [];
    allProjects.forEach((doc) =>
      res.push({
        id: doc.id,
        ...doc.data(),
      })
    );
    return res;
  }

  public static async fetchAllPaginate(pageNum: number): Promise<Project[] | undefined> {
    const allProjects = await firestoreInstance
      .collection(PROJECT_COLLECTION_NAME)
      .orderBy("updatedAt", "desc")
      .limit(perPage)
      .offset(perPage * (pageNum - 1))
      .get();
    if (allProjects.empty) return undefined;
    const res: any = [];
    allProjects.forEach((doc) =>
      res.push({
        id: doc.id,
        ...doc.data(),
      })
    );
    return res;
  }

  public static async updateResourcesLinks(id: string, updates: any): Promise<any> {
    const project = await this.findById(id);
    if (project) delete project["id"];
    if (!project) return undefined;
    if (!project.resources) project.resources = {};
    project.resources = { ...project.resources, ...updates };
    return await this.update(id, project);
  }

  public static async joinProject(id: string, user: User): Promise<Project | undefined> {
    const project = await this.findById(id);
    if (!project) return undefined;
    if (!user.profilePic) return undefined;
    if (!user.id) return undefined;
    if (!project.teamMembers) project.teamMembers = [];
    if (!project.teamMembersProfilePic) project.teamMembersProfilePic = [];
    if (!project.teamMembersId) project.teamMembersId = [];
    Logger.info("test1");
    const members: Array<string> = project.teamMembers;
    const pArr: Array<string> = project.teamMembersProfilePic;
    const idArr: Array<string> = project.teamMembersId;
    if (!members.includes(user.full_name))
      members.push(user.full_name);
    if (!pArr.includes(user.profilePic))
      pArr.push(user.profilePic);
    if (!idArr.includes(user.id))
      idArr.push(user.id);
    project.teamMembers = members;
    project.teamMembersProfilePic = pArr;
    project.teamMembersId = idArr;
    Logger.info("test 4"+JSON.stringify(project));
    await this.update(id, project);
    Logger.info("test 5");
    return project;
  }
  public static async leaveProject(id: string, user: User): Promise<any> {
    const project = await this.findById(id);
    if (!project) return undefined;
    if (!user.profilePic) return undefined;
    if (!user.id) return undefined;
    if (!project.teamMembers) return undefined;
    if (!project.teamMembersProfilePic) return undefined;
    if (!project.teamMembersId) return undefined;
    let members: Array<string> = project.teamMembers;
    let pArr: Array<string> = project.teamMembersProfilePic;
    let idArr: Array<string> = project.teamMembersId;
    if (members.includes(user.full_name))
      members = this.arrayRemove(members, user.full_name);
    else
      return undefined;
    if (pArr.includes(user.profilePic))
      pArr = this.arrayRemove(pArr, user.profilePic);
    if (idArr.includes(user.id))
      idArr = this.arrayRemove(idArr, user.id);
    return await this.update(id, project);
  }

  public static async replaceTMNameForProject(id: string, oldName: string, newName: string) {
    const project = await this.findById(id);
    if (!project) return undefined;
    if (!project.teamMembers) return undefined;
    let members: Array<string> = project.teamMembers;
    if (members.includes(oldName))
      members = this.arrayReplace(members, oldName, newName);
    else
      return undefined;
    return await this.update(id, project);
  }
  public static async replaceTMProfPicForProject(id: string, oldProfPic: string, newProfPic: string) {
    const project = await this.findById(id);
    if (!project) return undefined;
    if (!project.teamMembersProfilePic) return undefined;
    let members: Array<string> = project.teamMembersProfilePic;
    if (members.includes(oldProfPic))
      members = this.arrayReplace(members, oldProfPic, newProfPic);
    else
      return undefined;
    return await this.update(id, project);
  }

  public static async updateTeamMemberName(user: User, newName: string): Promise<any> {
    const projects: Project[] = await this.findByUser(user.id as string) as Project[];
    projects.forEach(async (project: Project) => {
      await this.replaceTMNameForProject(project.id as string, user.full_name, newName);
    })
    return;
  }

  public static async updateTeamMemberProfilePic(user: User, newProfPic: string): Promise<any> {
    const projects: Project[] = await this.findByUser(user.id as string) as Project[];
    projects.forEach(async (project: Project) => {
      await this.replaceTMProfPicForProject(project.id as string, user.profilePic as string, newProfPic);
    })
    return;
  }

  private static arrayRemove(arr: Array<any>, value: any): Array<string> {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  private static arrayReplace(arr: Array<any>, oldValue: any, newValue: any): Array<string> {
    return arr.map((ele) => (ele === oldValue) ? newValue : ele);
  }


  public static async updateWanted(id: string, updates: any): Promise<any> {
    const project = await this.findById(id);
    if (project) delete project["id"];
    if (!project) return undefined;
    if (!project.wanted) project.wanted = [];
    project.wanted = { ...project.wanted, ...updates };
    await this.update(id, project);
  }
}


