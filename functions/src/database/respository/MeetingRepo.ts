import { meetingsRef } from "../..";
import Meeting from "../model/Meeting";





export default class MeetingRepo {
    public static async create(meeting: Meeting): Promise<Meeting> {
        const createdUserRef = meetingsRef.doc();
        await createdUserRef.set(meeting, { merge: true });
        const newUser = await (await createdUserRef.get()).data() as Meeting;
        return { ...newUser, id: createdUserRef.id };
    }