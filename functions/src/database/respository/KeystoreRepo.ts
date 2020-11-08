import { FirestoreDocRef, keystoreRef } from "../..";
import Keystore from "../model/KeyStore";


export default class KeystoreRepo {
    public static async create(keystore:Keystore): Promise<FirestoreDocRef> {
        const now = new Date();
        const createdKeystoreRef = keystoreRef.doc(keystore.client);
        keystore.status = true;
        keystore.createdAt = keystore.updatedAt = now.toISOString();
        await createdKeystoreRef.set(keystore, { merge: true });
        return createdKeystoreRef;
    }
    public static async findById(id: string): Promise<Keystore | undefined> {
        const snapshot = await keystoreRef.doc(id).get();
        if (!snapshot.exists) return undefined;
        const data = snapshot.data() as Keystore;
        return { id: snapshot.id, ...data };
      }

    public static async find(client:FirestoreDocRef,primaryKey:string,secondaryKey:string) {
        const snapshot =await  keystoreRef.doc(client.id).get();
        if (!snapshot.exists) return undefined;
        return { id: snapshot.id, ...snapshot.data() };
    }
    public static async delete(id: string): Promise<any> {
        const res = await keystoreRef.doc(id).delete();
        return res;
      }
}