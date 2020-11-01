import { usersRef } from "../../index";
import { FirestoreDoc, FirestoreDocRef, firestoreInstance } from "../..";
import User, { USER_COLLECTION_NAME } from "../model/User";

export default class UserRepo {
  public static async create(user: User): Promise<FirestoreDocRef> {
    const createdUserRef = usersRef.doc(user.email);
    await createdUserRef.set(user, { merge: true });
    return createdUserRef;
  }

  public static async findByEmail(
    email: string
  ): Promise<FirestoreDoc | undefined> {
    const user = await usersRef.doc(email).get();
    return user.data();
  }

  public static async fetchAll(): Promise<FirestoreDoc[]> {
    const allUsers = await firestoreInstance
      .collection(USER_COLLECTION_NAME)
      .get();
    const allUsersDocs = allUsers.docs.map((doc) => doc.data());

    return allUsersDocs;
  }
}
