"use strict";
exports.__esModule = true;
var index_1 = require("./index");
var api = index_1["default"].getInstance();
// api.host = 'https://itbug.shop'
api.host = 'http://localhost';
api.token = '12121212';
// api.getBlogList(1,10).then(value => {
//     console.log(value)
// })
// api.logout().then(value => {
//     successResultHandle(value,data => {
//         console.log(data)
//     },message => {
//         console.log(message)
//     })
// })
// api.getCategoryForTableData({page: 0, pageSize: 12},).then(r => {
//     console.log(r)
// })
//
// api.userList({page:0,pageSize:20}).then(value => {
//     console.log(value)
// })
api.getPics(1).then(function (value) {
    console.log(value);
});
api.getVersionList({ page: 1, pageSize: 12 }).then(function (value) { return console.log(value); });
