import { usersRef } from "../../index";
import { FirestoreDoc, FirestoreDocRef, firestoreInstance } from "../..";
import User, { USER_COLLECTION_NAME } from "../model/User";

export default class UserRepo {
  public static async create(user: User): Promise<FirestoreDocRef> {
    const createdUserRef = usersRef.doc();
    user.verified=false;
    await createdUserRef.set(user, { merge: true });
    return createdUserRef;
  }

  public static async findByEmail(
    email: string
  ): Promise<FirestoreDoc | undefined> {
    const snapshot = await usersRef.where("email", "==", email).get();
    if (snapshot.empty) return undefined;
    const res: any = [];
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res[0];
  }
  public static async findById(id: string): Promise<User | undefined> {
    const snapshot = await usersRef.doc(id).get();
    if (!snapshot.exists) return undefined;
    const data = snapshot.data() as User;
    return { id: snapshot.id, ...data};
  }

  public static async fetchAll(): Promise<FirestoreDoc[] | undefined> {
    const allUsers = await firestoreInstance
      .collection(USER_COLLECTION_NAME)
      .get();
    if (allUsers.empty) return undefined;
    const res: any = [];
    allUsers.forEach((doc) =>
      res.push({
        id: doc.id,
        ...doc.data(),
      })
    );
    return res;
  }
  public static async delete(id: string): Promise<any> {
    const res = await usersRef.doc(id).delete();
    return res;
  }

  public static async update(id: string, updates: any): Promise<any> {
    await usersRef.doc(id).update(updates);
  }

  public static async updatePersonalLinks(
    id: string,
    updates: any
  ): Promise<any> {
    const user = await this.findById(id);
    if (!user) return undefined;
    if (!user.personal_profiles) user.personal_profiles = {};
    user.personal_profiles = { ...user.personal_profiles, ...updates };
    this.update(id, user);
  }
}
