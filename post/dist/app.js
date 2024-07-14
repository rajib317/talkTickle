"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const Post_Router_1 = __importDefault(require("./routes/Post.Router"));
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
const Post_Model_1 = __importDefault(require("./models/Post.Model"));
const jwtVerify_1 = __importDefault(require("./helpers/jwtVerify"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const port = process.env.PORT || 3000;
app.use('/posts', jwtVerify_1.default, Post_Router_1.default);
// app.use('/posts', PostRouter);
// 404
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    next(http_errors_1.default.NotFound());
}));
// Errror handeler
app.use((err, req, res, next) => {
    if (err.isJoi)
        res.status(422);
    res.send({
        error: {
            status: err.isJoi ? 422 : err.status || 500,
            message: err.message,
        },
    });
});
Post_Model_1.default.sync();
// Post.sync({ alter: true, force: true });
app.listen(port, () => `Server running on port ${port}`);
