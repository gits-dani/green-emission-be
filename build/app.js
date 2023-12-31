"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./config/passport"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const userProfileRoute_1 = __importDefault(require("./routes/userProfileRoute"));
const emissionPredictRoute_1 = __importDefault(require("./routes/emissionPredictRoute"));
const app = (0, express_1.default)();
const port = 3000;
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false })); // Tambahkan ini untuk meng-handle form-data
app.use((0, express_session_1.default)({
    secret: "secretSession",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize()); // inisialisasi passport di express
app.use(passport_1.default.session()); // mengelola otentikasi passport berbasis sesi
app.use("/api", userRoute_1.default);
app.use("/api", userProfileRoute_1.default);
app.use("/api", emissionPredictRoute_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
