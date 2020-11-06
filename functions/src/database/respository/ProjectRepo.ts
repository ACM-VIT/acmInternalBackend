import { FirestoreDoc, FirestoreDocRef, projectsRef } from "../..";
import Project from "../model/Project";

export default class ProjectRepo {
  public static async create(project: Project): Promise<FirestoreDocRef> {
    const createdProjectRef = await projectsRef.doc();
    createdProjectRef.set(project, { merge: true });
    return createdProjectRef;
  }

  public static async findByName(
    name: string
  ): Promise<FirestoreDoc | undefined> {
    const snapshot = await projectsRef.where("name", "==", name).get();
    if (snapshot.empty) return undefined;
    const res: any = [];
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res[0];
  }
}
