import passport from "passport";
import { Strategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";

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
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        // cek user berdasarkan username
        const user = await prisma.user.findUnique({
          where: {
            email,
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
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      // ambil confirmPassword
      const confirmPassword = req.body.confirmPassword;

      // validasi: jika data ada yang tidak diisi
      if (!email || !password || !confirmPassword) {
        return done(null, false, {
          message: "Data email, password, dan confirmPassword harus diisi",
        });
      }

      // validasi: apakah email valid
      if (!validator.isEmail(email)) {
        return done(null, false, { message: "Email tidak valid" });
      }

      // cek user di db
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      // validasi: jika user sudah ada
      if (existingUser) {
        return done(null, false, { message: "User sudah ada" });
      }

      // validasi: jika password tidak sama
      if (password !== confirmPassword) {
        return done(null, false, {
          message: "Password dam Confirm Password harus sama",
        });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashPassword,
        },
      });

      done(null, newUser);
    }
  )
);

export default passport;
