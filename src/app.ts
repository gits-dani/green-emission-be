import express, { Express } from "express";
import session from "express-session";
import passport from "./config/passport";
import "dotenv/config";
import cors from "cors";

import userRoute from "./routes/userRoute";
import userProfileRoute from "./routes/userProfileRoute";
import emissionPredictRoute from "./routes/emissionPredictRoute";

const app: Express = express();
const port = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Tambahkan ini untuk meng-handle form-data

app.use(
  session({
    secret: "secretSession",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize()); // inisialisasi passport di express
app.use(passport.session()); // mengelola otentikasi passport berbasis sesi

app.use("/api", userRoute);
app.use("/api", userProfileRoute);
app.use("/api", emissionPredictRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
