"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.UserType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserType;
(function (UserType) {
    UserType["TEACHER"] = "teacher";
    UserType["STUDENT"] = "student";
    UserType["HOBBYIST"] = "hobbyist";
    UserType["RESEARCHER"] = "researcher";
})(UserType || (exports.UserType = UserType = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "male";
    Gender["FEMALE"] = "female";
    Gender["OTHER"] = "other";
})(Gender || (exports.Gender = Gender = {}));
