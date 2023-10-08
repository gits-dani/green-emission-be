import passport from "passport";
import { Strategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// serialisasi
passport.serializeUser((user: any, done: any) => {
  done(null, user.id);
});

// deserialisasi
passport.deserializeUser(async (id: any, done: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    done(null, user);
  } catch (error) {
    done(error);
  }
});

// strategy local-login
passport.use(
  "local-login",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        // cek user berdasarkan username
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        // validasi: jika user tidak ditemukan
        if (!user) {
          return done(null, false, { message: "User tidak ditemukan" });
        }

        // compare password
        const validPassword = await bcrypt.compare(password, user.password);

        // validasi: jika password salah
        if (!validPassword) {
          return done(null, false, { message: "Password salah" });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// strategy local-register
passport.use(
  "local-register",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      // cek user di db
      const existingUser = await prisma.user.findUnique({
        where: {
          username,
        },
      });

      // validasi: jika user sudah ada
      if (existingUser) {
        return done(null, false, { message: "User sudah ada" });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          username,
          password: hashPassword,
        },
      });

      done(null, newUser);
    }
  )
);

export default passport;
