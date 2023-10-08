import express, { Express } from "express";
import session from "express-session";
import passport from "./config/passport";

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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
