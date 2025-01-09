var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Table, Model, BeforeCreate, BeforeUpdate, } from "sequelize-typescript";
const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let User = (() => {
    let _classDecorators = [Table({
            tableName: "users",
            timestamps: true,
            modelName: "User",
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Model;
    let _staticExtraInitializers = [];
    let _static_hashPassword_decorators;
    let _static_hashPasswordOnUpdate_decorators;
    var User = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.comparePassword = async (enteredPassword) => {
                return await bcrypt.compare(enteredPassword, this.password);
            };
        }
        static hashPassword(instance) {
            instance.password = bcrypt.hashSync(instance.password, 10);
        }
        static hashPasswordOnUpdate(instance) {
            instance.password = bcrypt.hashSync(instance.password, 10);
        }
        SignAccessToken() {
            return jwt.sign({
                id: this.id,
            }, process.env.ACCESS_TOKEN_SECRET || "", {
                expiresIn: "1h",
            });
        }
        SignRefreshToken() {
            return jwt.sign({
                id: this.id,
            }, process.env.REFRESH_TOKEN_SECRET || "", {
                expiresIn: "3d",
            });
        }
    };
    __setFunctionName(_classThis, "User");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _static_hashPassword_decorators = [BeforeCreate];
        _static_hashPasswordOnUpdate_decorators = [BeforeUpdate];
        __esDecorate(_classThis, null, _static_hashPassword_decorators, { kind: "method", name: "hashPassword", static: true, private: false, access: { has: obj => "hashPassword" in obj, get: obj => obj.hashPassword }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(_classThis, null, _static_hashPasswordOnUpdate_decorators, { kind: "method", name: "hashPasswordOnUpdate", static: true, private: false, access: { has: obj => "hashPasswordOnUpdate" in obj, get: obj => obj.hashPasswordOnUpdate }, metadata: _metadata }, null, _staticExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _staticExtraInitializers);
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
export default User;
