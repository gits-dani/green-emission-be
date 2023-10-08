import express, { Express } from "express";
import session from "express-session";
import passport from "./config/passport";

import userRoute from "./routes/userRoute";
import userProfileRoute from "./routes/userProfileRoute";

const app: Express = express();
const port = 3000;

// middleware
app.use(express.json());

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
