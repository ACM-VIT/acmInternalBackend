import User from "./User";

export const MEETING_COLELCTION_NAME = "meetings";

export enum MeetingStatus {
    CONFIRMED = "confirmed",
    POSTPONED = "postponed",
    CANCELLED = "cancelled"
}

export default interface Meeting {
    title: string;
    about: string;
    status: MeetingStatus;
    start: Date;
    initiator: User;
}
