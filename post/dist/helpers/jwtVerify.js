"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!token)
        return next(http_errors_1.default.Unauthorized('No token provided'));
    if (!secret)
        return next(http_errors_1.default.BadGateway('Server configuration error'));
    jsonwebtoken_1.default.verify(token, secret, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(http_errors_1.default.Unauthorized(message));
        }
        const aud = payload.aud;
        if (typeof aud === 'string') {
            const audNumber = Number(aud);
            if (!isNaN(audNumber)) {
                req.payload = audNumber;
            }
            else {
                return next(http_errors_1.default.Unauthorized('Invalid audience value'));
            }
        }
        else {
            return next(http_errors_1.default.Unauthorized('Invalid audience value'));
        }
        next();
    });
};
exports.default = verifyToken;
