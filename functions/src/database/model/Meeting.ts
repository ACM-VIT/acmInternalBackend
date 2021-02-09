import User from "./User";

export const MEETING_COLELCTION_NAME = "Meetings";

export enum MeetingStatus {
    CONFIRMED = "confirmed",
    POSTPONED = "postponed",
    CANCELLED = "cancelled"
}

export default interface Meeting {
    id?: string;
    title: string;
    about: string;
    status: MeetingStatus;
    start: Date;
    initiator: User;
}
