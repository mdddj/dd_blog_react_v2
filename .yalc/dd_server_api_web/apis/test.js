"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var api = index_1.default.getInstance();
api.host = 'http://localhost';
api.deleteFileinfo(1).then(function (value) {
    console.log(value);
});
