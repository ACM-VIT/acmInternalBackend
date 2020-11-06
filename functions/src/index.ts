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
