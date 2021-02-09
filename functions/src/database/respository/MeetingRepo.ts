import { meetingsRef } from "../..";
import Meeting from "../model/Meeting";





export default class MeetingRepo {
    public static async create(meeting: Meeting): Promise<Meeting> {
        const createdMeetingRef = meetingsRef.doc();
        await createdMeetingRef.set(meeting, { merge: true });
        const newUser = await (await createdMeetingRef.get()).data() as Meeting;
        return { ...newUser, id: createdMeetingRef.id };
    }
    public static async findByTitleAndTime(
        title: string,
        time: string,
    ): Promise<Meeting | undefined> {
        const snapshot = await meetingsRef.where("title", "==", title).where("time", "==", time).get();
        if (snapshot.empty) return undefined;
        const res: any = [];
        snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
        return res[0];
    }
}