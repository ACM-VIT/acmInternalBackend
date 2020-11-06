import { FirestoreDoc, FirestoreDocRef, firestoreInstance, projectsRef } from "../..";
import Project, { PROJECT_COLLECTION_NAME } from "../model/Project";

export default class ProjectRepo {
  public static async create(project: Project): Promise<FirestoreDocRef> {
    const createdProjectRef = await projectsRef.doc();
    createdProjectRef.set(project, { merge: true });
    return createdProjectRef;
  }

  public static async findByName(
    name: string
  ): Promise<FirestoreDoc | undefined> {
    let res: any = [];
    const snapshot = await projectsRef.where("name", "==", name).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }

  public static async delete(id: string): Promise<any> {
    const res = await projectsRef.doc(id).delete();
    return res;
  }
  public static async findById(id: string): Promise<FirestoreDoc | undefined> {
    const snapshot = await projectsRef.doc(id).get();
    if (!snapshot.exists) return undefined;
    return { id: snapshot.id, ...snapshot.data() };
  }

  public static async fetchAll(): Promise<FirestoreDoc[] | undefined> {
    const allProjects = await firestoreInstance
      .collection(PROJECT_COLLECTION_NAME)
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

}
