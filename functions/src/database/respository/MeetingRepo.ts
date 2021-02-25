import { meetingsRef } from "../..";
import Logger from "../../core/Logger";
import Meeting from "../model/Meeting";
import User from "../model/User";


const perPage = 15;


export default class MeetingRepo {
    public static async create(meeting: Meeting): Promise<Meeting> {
        meeting.updatedAt = new Date();
        const createdMeetingRef = meetingsRef.doc();
        await createdMeetingRef.set(meeting, { merge: true });
        const newUser = await (await createdMeetingRef.get()).data() as Meeting;
        return { ...newUser, id: createdMeetingRef.id };
    }

    public static async update(id: string, updates: any): Promise<any> {
      updates["updatedAt"] = new Date();
      return meetingsRef.doc(id).update(updates);
    }

    public static async findByTitleAndStartTime(
        title: string,
        start: string,
    ): Promise<Meeting | undefined> {
        const snapshot = await meetingsRef.where("title", "==", title).where("start", "==", start).orderBy("updatedAt","desc").get();
        if (snapshot.empty) return undefined;
        const res: any = [];
        snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
        return res[0];
    }
    public static async fetchAll(): Promise<Meeting[] | undefined> {
        const allMeetings = await meetingsRef
          .orderBy("updatedAt", "desc")
          .get();
        if (allMeetings.empty) return undefined;
        const res: any = [];
        allMeetings.forEach((doc) =>
          res.push({
            id: doc.id,
            ...doc.data(),
          })
        );
        return res;
      }
      public static async fetchAllPaginate(pageNum:number): Promise<Meeting[] | undefined> {
        const allMeetings = await meetingsRef
          .orderBy("updatedAt", "desc")
          .limit(perPage)
          .offset(perPage*(pageNum-1))
          .get();
        if (allMeetings.empty) return undefined;
        const res: any = [];
        allMeetings.forEach((doc) =>
          res.push({
            id: doc.id,
            ...doc.data(),
          })
        );
        return res;
      }

      public static async fetchByInitiator(user:User): Promise<Meeting[] | undefined> {
        const allMeetings = await meetingsRef
          .where("initiator","==",user)
          .orderBy("updatedAt", "desc")
          .get();
        if (allMeetings.empty) return undefined;
        const res: any = [];
        allMeetings.forEach((doc) =>
          res.push({
            id: doc.id,
            ...doc.data(),
          })
        );
        return res;
      }
      public static async fetchByInitiatorPaginate(user:User,pageNum:number): Promise<Meeting[] | undefined> {
        const allMeetings = await meetingsRef
          .where("initiator","==",user)
          .orderBy("updatedAt", "desc")
          .limit(perPage)
          .offset(perPage*(pageNum-1))
          .get();
        if (allMeetings.empty) return undefined;
        const res: any = [];
        allMeetings.forEach((doc) =>
          res.push({
            id: doc.id,
            ...doc.data(),
          })
        );
        return res;
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


  public static async findByTitlePartial(name: string): Promise<Meeting[] | undefined> {
    const end = name.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
    let res: any = [];
    const snapshot = await meetingsRef.where('title', '>=',name).where('title', '<', end).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }
  public static async findByTitlePartialPaginate(name: string,pageNum:number): Promise<Meeting[] | undefined> {
    const end = name.replace(/.$/, c => String.fromCharCode(c.charCodeAt(0) + 1));
    let res: any = [];
    const snapshot = await meetingsRef.where('title', '>=',name).where('title', '<', end).limit(perPage).offset(perPage * (pageNum - 1)).get();
    if (snapshot.empty) return undefined;
    snapshot.forEach((ele) => res.push({ id: ele.id, ...ele.data() }));
    return res;
  }


    public static async deleteMeeting(id: string): Promise<any> {
        const doc = await meetingsRef.doc(id);
        await doc.delete();
        console.log(`deleted: ${id}`);
        return;
    }

    public static async addToMeeting(id: string, users: Array<User>): Promise<any | undefined> {
      const meeting = await this.findById(id);
      Logger.info("test0"+JSON.stringify(meeting,null,2));
      Logger.info("test0"+JSON.stringify(users,null,4));
      if (!meeting) return "np";
      if (!meeting.attendeesName) meeting.attendeesName = [];
      if (!meeting.attendeesProfiePic) meeting.attendeesProfiePic = [];
      if (!meeting.attendeesId) meeting.attendeesId = [];
      Logger.info("test1");
      const members: Array<string> = meeting.attendeesName;
      const pArr: Array<string> = meeting.attendeesProfiePic;
      const idArr: Array<string> = meeting.attendeesId;

      for(let user of users) {
        if (!user.profilePic) return "pp";
        if (!user.id) return "id";
      
        if (!members.includes(user.full_name))
          members.push(user.full_name);
        if (!pArr.includes(user.profilePic))
          pArr.push(user.profilePic);
        if (!idArr.includes(user.id))
          idArr.push(user.id);
      }

     
      meeting.attendeesName = members;
      meeting.attendeesProfiePic = pArr;
      meeting.attendeesId = idArr;
      Logger.info("test 4"+JSON.stringify(meeting));
      await this.update(id, meeting);
      Logger.info("test 5");
      return meeting;
    }
}