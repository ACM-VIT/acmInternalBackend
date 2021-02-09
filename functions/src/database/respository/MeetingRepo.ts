import { FirestoreDocRef, meetingsRef } from "../..";
import Meeting from "../model/Meeting";


export default class MeetingRepo {
    public static async create(meeting: Meeting): Promise<FirestoreDocRef> {
        const createdProjectRef = await meetingsRef.doc();
        createdProjectRef.set(meeting, { merge: true });
        return createdProjectRef;
    }
}