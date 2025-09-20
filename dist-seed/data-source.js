"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
var data_1 = require("@secure-task-manager/data");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite', // or 'postgres'
    database: 'db.sqlite',
    entities: [data_1.User, data_1.Task, data_1.Organization],
    synchronize: true, // dev only
});
