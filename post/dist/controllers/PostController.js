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
const validation_schema_1 = require("../helpers/validation_schema");
const Post_Model_1 = __importDefault(require("../models/Post.Model"));
exports.default = {
    create: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield validation_schema_1.createPostSchema.validateAsync(req.body);
            yield Post_Model_1.default.create({
                description: result.description,
                image: result.image,
                voice: result.voice,
            });
            res.send({ message: 'post created!' });
        }
        catch (error) {
            next(error);
        }
    }),
    recommended: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }),
    recent: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('req.headers');
            const result = yield Post_Model_1.default.findAll();
            res.send(result);
        }
        catch (error) {
            next(error);
        }
    }),
};
