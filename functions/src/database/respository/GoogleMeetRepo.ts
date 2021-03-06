import crypto from 'crypto';
import { google } from "googleapis";
import { GOOGLE_CALENDER } from "../../config";
import Meeting from "../model/Meeting";

type numorstring = number | string;

const CREDENTIALS = GOOGLE_CALENDER.credentials;
const calendarId = GOOGLE_CALENDER.calenderID;

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    undefined,
    CREDENTIALS.private_key,
    SCOPES
);

const TIMEOFFSET = '+05:30';

export default class GoogleMeet {

    private static dateTimeForCalander(dateInput: Date) {

        let date: Date = dateInput;

        let year: numorstring = date.getFullYear();
        let month: numorstring = date.getMonth() + 1;


        if (month < 10) {
            month = `0${month}`;
        }
        let day: numorstring = date.getDate();

        if (day < 10) {
            day = `0${day}`;
        }
        let hour: numorstring = date.getHours();
        if (hour < 10) {
            hour = `0${hour}`;
        }
        let minute: numorstring = date.getMinutes();
        if (minute < 10) {
            minute = `0${minute}`;
        }

        let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

        let event = new Date(Date.parse(newDateTime));

        let startDate = event;
        // Delay in end time is 1
        let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));

        return {
            'start': startDate,
            'end': endDate
        }
    };

    // Insert new event to Google Calendar
    private static async insertEvent(event: any): Promise<any> {
        try {
            let response = await calendar.events.insert({
                auth,
                calendarId,
                resource: event,
            } as any);
            //  console.log("google response ", JSON.stringify(response,null,2));
            if (response['status'] == 200 && response['statusText'] === 'OK') {
                // console.log(JSON.stringify(response.data, null, 2));
                return response.data;
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(`Error at insertEvent --> ${error}`);
            return undefined;
        }
    };

    public static async insertEventIntoCal(meeting: Meeting): Promise<any> {
        // console.log("second func",JSON.stringify(app,null,3));
        const startDateTime: Date = new Date(meeting.start);
        let dateTime = this.dateTimeForCalander(startDateTime);
        const id = await crypto.randomBytes(20).toString('hex')
        // Event for Google Calendar
        let event = {
            'summary': `${meeting.title}`,
            'description': `About:\n${meeting.about}\n\nMeeting scheduled by:\n${meeting.initiator.full_name}`,
            "conferenceDataVersion": 1,
            'start': {
                'dateTime': dateTime['start'],
                'timeZone': 'Asia/Kolkata'
            },
            'end': {
                'dateTime': dateTime['end'],
                'timeZone': 'Asia/Kolkata'
            },
            "conferenceData": {
                "createRequest": {
                    "conferenceSolutionKey": {
                        "type": "hangoutsMeet"
                    },
                    "requestId": id,
                }
            },
            'reminders': {
                'useDefault': false,
                'overrides': [
                    { 'method': 'email', 'minutes': 24 * 60 },
                    { 'method': 'popup', 'minutes': 10 },
                ],
            },
        };
        try {
            const result = await this.insertEvent(event);
            console.log("insertevent into cal success", JSON.stringify(result, null, 3));
            if (!result) return undefined;
            return result;
        } catch (err) {
            console.log("insertevent into cal failed ", err);
            return undefined;
        }
    }

    public static async deleteEvent(eventId: string): Promise<any> {

        try {
            let response = await calendar.events.delete({
                auth: auth,
                calendarId: calendarId,
                eventId: eventId
            });
            //  console.log(JSON.stringify(response, null, 3));
            if (response['status'] === 204 && response['statusText'] === "No Content") {
                return response.data;
            } else {
                return undefined;
            }
        } catch (error) {
            console.log(`Error at deleteEvent --> ${error}`);
            return undefined;
        }
    };


    // //Get all the events between two dates
    // private static async getEvents(dateTimeStart: any, dateTimeEnd: any) {

    //     try {
    //         let response = await calendar.events.list({
    //             auth: auth,
    //             calendarId: calendarId,
    //             timeMin: dateTimeStart,
    //             timeMax: dateTimeEnd,
    //             timeZone: 'Asia/Kolkata'
    //         });

    //         let items = response['data']['items'];
    //         return items;
    //     } catch (error) {
    //         console.log(`Error at getEvents --> ${error}`);
    //         return 0;
    //     }
    // };

}


