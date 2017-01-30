"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var inversify_express_utils_1 = require('inversify-express-utils');
var inversify_1 = require('inversify');
var identifiers_1 = require('../constants/identifiers');
var UserController = (function () {
    function UserController(userService) {
        this.userService = userService;
    }
    UserController.prototype.getUsers = function () {
        return this.userService.getUsers();
    };
    UserController.prototype.getUser = function (request) {
        return this.userService.getUser(request.params.id);
    };
    UserController.prototype.newUser = function (request) {
        return this.userService.newUser(request.body);
    };
    UserController.prototype.updateUser = function (request) {
        return this.userService.updateUser(request.params.id, request.body);
    };
    UserController.prototype.deleteUser = function (request) {
        return this.userService.deleteUser(request.params.id);
    };
    __decorate([
        inversify_express_utils_1.Get('/')
    ], UserController.prototype, "getUsers", null);
    __decorate([
        inversify_express_utils_1.Get('/:id')
    ], UserController.prototype, "getUser", null);
    __decorate([
        inversify_express_utils_1.Post('/')
    ], UserController.prototype, "newUser", null);
    __decorate([
        inversify_express_utils_1.Put('/:id')
    ], UserController.prototype, "updateUser", null);
    __decorate([
        inversify_express_utils_1.Delete('/:id')
    ], UserController.prototype, "deleteUser", null);
    UserController = __decorate([
        inversify_1.injectable(),
        inversify_express_utils_1.Controller('/user'),
        __param(0, inversify_1.inject(identifiers_1.default.UserService))
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
