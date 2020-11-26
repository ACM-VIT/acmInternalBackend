import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import RequestLogger from "./core/RequestLogger";
import bodyParser from "body-parser";
import morgan from "morgan";
import { corsUrl, environment } from "./config";
import routesV1 from "./routes/v1";
import { ApiError, InternalError, NotFoundError } from "./core/ApiError";
import Logger from "./core/Logger";
import { USER_COLLECTION_NAME } from "./database/model/User";
import { SuccessMsgResponse } from "./core/ApiResponse";
import { PROJECT_COLLECTION_NAME } from "./database/model/Project";
import { KEYSTORE_COLLECTION_NAME } from "./database/model/KeyStore";
import { ROLES_COLLECTION_NAME } from "./database/model/Role";
import {populateRole} from './database'

//Firestore dec start
try {
  admin.initializeApp(functions.config().firebase);
} catch (e) {
  functions.logger.info("Error in initilizing firestore");
}
export const firestoreInstance = admin.firestore();
export const firestoreAltInstance = admin.firestore;
export type FirestoreDocRef = FirebaseFirestore.DocumentReference<
  FirebaseFirestore.DocumentData
>;
export type FirestoreDoc = FirebaseFirestore.DocumentData;
export const usersRef = firestoreInstance.collection(USER_COLLECTION_NAME);
export const projectsRef = firestoreInstance.collection(
  PROJECT_COLLECTION_NAME
);
export const keystoreRef = firestoreInstance.collection(KEYSTORE_COLLECTION_NAME);
export const rolesRef = firestoreInstance.collection(ROLES_COLLECTION_NAME);
export const PROJECT_FCM_TOPIC="projects";
(async ()=>{
  await populateRole();
})()
//Firestore dec end

const app = express();
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));
app.use(morgan("tiny", { stream: RequestLogger }));

app.use("/v1", routesV1);
app.get("/", (req, res) => {
  new SuccessMsgResponse(
    "Welcome to the Acm Internal Ecosystem Backend v1.0"
  ).send(res);
});

app.use((req, res, next) => next(new NotFoundError()));
//@ts-ignore
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    //@ts-ignore
    if (environment === "development") {
      Logger.error(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export const App = functions.https.onRequest(app);
export const SubscribeUserToTopics = functions.firestore.document('Users/{userId}').onUpdate((change, context) => {
  // Get an object representing the document
  // e.g. {'name': 'Marie', 'age': 66}
  const newValue = change.after.data();

   console.log("Id: " + context.params.userId)
  // access a particular field as you would any JS property
  if(newValue.fcm_token) {
    const fcm_token = newValue.fcm_token;
    console.log("fcm_token: ",fcm_token);
    // perform desired operations ...
    admin.messaging().subscribeToTopic(fcm_token,PROJECT_FCM_TOPIC)
    .then(function(response) {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topic:', response);
    })
    .catch(function(error) {
      console.log('Error subscribing to topic:', error);
    });
  }
  return null;
});
export const NotifyNewProject = functions.firestore.document('Projects/{projectId}').onCreate((snap, context) => {
    const newProject = snap.data();
    console.log(newProject, 'written by', context.params.projectId);
    if(!newProject.name || typeof(newProject.name) != "string") {
      console.log("projet name not valid i.e not exists or is not a string");
      return;
    }
    if(!newProject.desc || typeof(newProject.desc) != "string") {
      console.log("projet name not valid i.e not exists or is not a string");
      return;
    }
  const notification= {
    data: {
      experienceId: "@madrigal1/acminternalapprn",
      title: newProject.name,
      message: newProject.desc,
      body:JSON.stringify(newProject)
    },
    priority:"high",
    topic:PROJECT_FCM_TOPIC,
  } as admin.messaging.Message;
  admin.messaging().send(notification)
  .then((response) => {
    // Response is a message ID string.
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

  return null;
});

