"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostController_1 = __importDefault(require("../controllers/PostController"));
const router = express_1.default.Router();
router.get('/recommended', PostController_1.default.recommended);
router.get('/recent', PostController_1.default.recent);
router.post('/create', PostController_1.default.create);
exports.default = router;
