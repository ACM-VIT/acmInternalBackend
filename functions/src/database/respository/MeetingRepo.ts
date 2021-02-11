import { meetingsRef } from "../..";
import Meeting from "../model/Meeting";





export default class MeetingRepo {
    public static async create(meeting: Meeting): Promise<Meeting> {
        const createdMeetingRef = meetingsRef.doc();
        await createdMeetingRef.set(meeting, { merge: true });
        const newUser = await (await createdMeetingRef.get()).data() as Meeting;
        return { ...newUser, id: createdMeetingRef.id };
    }
    public static async findByTitleAndStartTime(
        title: string,
        start: string,
    ): Promise<Meeting | undefined> {
        const snapshot = await meetingsRef.where("title", "==", title).where("start", "==", start).get();
        if (snapshot.empty) return undefined;
        const res: any = [];
        snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
        return res[0];
    }
    public static async findById(
        id: string,
    ): Promise<Meeting | undefined> {
        const snapshot = await meetingsRef.where("id", "==", id).get();
        if (snapshot.empty) return undefined;
        const res: any = [];
        snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
        return res[0];
    }
    public static async findByTitle(
        title: string,
    ): Promise<Meeting | undefined> {
        const snapshot = await meetingsRef.where("title", "==", title).get();
        if (snapshot.empty) return undefined;
        const res: any = [];
        snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
        return res[0];
    }

    public static async deleteMeeting(id: string): Promise<any> {
        const doc = await meetingsRef.where('id', '==', id).get();
        doc.forEach(element => {
            element.ref.delete();
            console.log(`deleted: ${element.id}`);
        });
        return;
    }
}