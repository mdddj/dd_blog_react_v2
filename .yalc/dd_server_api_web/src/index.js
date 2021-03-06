"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ServerUtil_1 = require("./utils/ServerUtil");
var umi_request_1 = require("umi-request");
/**
 * ???????????????
 */
var DdServerApiByWeb = /** @class */ (function () {
    function DdServerApiByWeb() {
    }
    Object.defineProperty(DdServerApiByWeb.prototype, "host", {
        get: function () {
            var _a;
            return (_a = this._host) !== null && _a !== void 0 ? _a : ServerUtil_1["default"].getInstance().host;
        },
        set: function (v) {
            this._host = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DdServerApiByWeb.prototype, "token", {
        get: function () {
            return this._token;
        },
        set: function (v) {
            this._token = v;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * ??????????????????
     * @constructor
     * @private
     */
    DdServerApiByWeb.prototype.DdTaokeSdk = function () {
    };
    /**
     * ????????????
     */
    DdServerApiByWeb.getInstance = function () {
        var _a;
        return (_a = this._instance) !== null && _a !== void 0 ? _a : new DdServerApiByWeb();
    };
    DdServerApiByWeb.prototype.createClient = function () {
        var client = (0, umi_request_1.extend)({});
        if (this.token) {
            var authHeader_1 = {
                Authorization: this.token
            };
            client.interceptors.request.use(function (url, options) {
                return {
                    url: url,
                    options: __assign(__assign({}, options), { headers: authHeader_1, interceptors: true })
                };
            }, { global: false });
        }
        return client;
    };
    /**
     * ???????????????????????????
     * @param url   ??????url
     * @param data  ????????????
     * @param method    ????????????
     * @param requestType ????????????
     */
    DdServerApiByWeb.prototype.requestT = function (url, data, method, requestType) {
        return __awaiter(this, void 0, void 0, function () {
            var param, postData, client;
            return __generator(this, function (_a) {
                method !== null && method !== void 0 ? method : (method = 'GET');
                param = method === 'GET' ? data : undefined;
                postData = method === 'POST' || method === 'DELETE' ? data : undefined;
                client = this.createClient();
                return [2 /*return*/, client("" + this.host + url, {
                        method: method !== null && method !== void 0 ? method : 'GET',
                        params: param,
                        data: postData,
                        requestType: requestType !== null && requestType !== void 0 ? requestType : (requestType = 'json')
                    })];
            });
        });
    };
    /**
     * ????????????????????????
     * @param pager ??????
     * @param user  ????????????
     */
    DdServerApiByWeb.prototype.userList = function (pager, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/user/list', Object.assign(user !== null && user !== void 0 ? user : {}, pager), 'GET')];
            });
        });
    };
    /**
     * ??????????????????
     * @param loginNumber   ?????????
     * @param password  ??????
     */
    DdServerApiByWeb.prototype.login = function (loginNumber, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/user/login', { loginNumber: loginNumber, password: password }, 'POST')];
            });
        });
    };
    /**
     * ????????????
     */
    DdServerApiByWeb.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/user/logout', {}, 'POST')];
            });
        });
    };
    /**
     * ??????jwt token ??????????????????
     *
     *
     *
     * @param token jwt token
     */
    DdServerApiByWeb.prototype.getUserInfo = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT("/api/get-user-by-token?token=" + token)];
            });
        });
    };
    /**
     * ?????????????????????
     */
    DdServerApiByWeb.prototype.pushNewBlog = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/blog-push-new', params, 'POST')];
            });
        });
    };
    /**
     * ??????????????????
     * @param blogId ??????id
     */
    DdServerApiByWeb.prototype.deleteBlog = function (blogId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/blog-delete', {
                        id: blogId
                    }, 'DELETE')];
            });
        });
    };
    /**
     * ??????????????????
     */
    DdServerApiByWeb.prototype.getBlogCategorys = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/category-list')];
            });
        });
    };
    /**
     * ???????????????????????????
     */
    DdServerApiByWeb.prototype.getBlogTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/tags')];
            });
        });
    };
    /**
     * ????????????id??????????????????
     * @param id  ??????id
     */
    DdServerApiByWeb.prototype.getBlogDetailById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/get/' + id)];
            });
        });
    };
    /**
     * ????????????????????????
     * @param pageModel ??????
     * @param category? ????????????
     * @constructor
     */
    DdServerApiByWeb.prototype.getCategoryForTableData = function (pageModel, category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/category/list', Object.assign(pageModel, category))];
            });
        });
    };
    /**
     * ????????????????????????????????????
     * @param category ???????????????????????????
     * @constructor
     */
    DdServerApiByWeb.prototype.saveAndUpdateBlogCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/blog-category-save', category, 'POST')];
            });
        });
    };
    /**
     * ??????????????????,???????????????????????????,??????????????????????????????????????????,?????????????????????
     * @param id  ??????id
     * @constructor
     */
    DdServerApiByWeb.prototype.deleteBlogCategory = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/blog-category-delete', id, 'DELETE')];
            });
        });
    };
    /**
     * ????????????
     * @param data ??????
     */
    DdServerApiByWeb.prototype.uploadFile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/file-upload', data, 'POST')];
            });
        });
    };
    /**
     * ?????????????????????
     * @param id  ????????????
     * @constructor
     */
    DdServerApiByWeb.prototype.getFolders = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/file/get-folders', { id: id })];
            });
        });
    };
    /**
     * ???????????????id????????????????????????????????????
     * @param folderId  ?????????id
     * @param pageModel ????????????
     * @constructor
     */
    DdServerApiByWeb.prototype.getFilesWithFolderId = function (folderId, pageModel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/file/get-files', Object.assign({ id: folderId }, pageModel))];
            });
        });
    };
    /**
     * ?????????????????????
     * @param name  ???????????????
     * @param parenFolder ???????????????
     * @constructor
     */
    DdServerApiByWeb.prototype.createFolder = function (name, parenFolder) {
        return __awaiter(this, void 0, void 0, function () {
            var cate;
            return __generator(this, function (_a) {
                cate = {
                    name: name,
                    type: 'folder'
                };
                if (parenFolder) {
                    cate.parentNode = parenFolder;
                }
                return [2 /*return*/, this.saveOrUpdateResourceCategory(cate)];
            });
        });
    };
    /**
     * ??????????????????
     * @param pageModel ????????????
     * @param resCategory ????????????
     * @constructor
     */
    DdServerApiByWeb.prototype.getResourceCategoryList = function (pageModel, resCategory) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/res/list', Object.assign(pageModel, resCategory))];
            });
        });
    };
    /**
     * ????????????????????????????????????
     * @param category  ??????
     * @constructor
     */
    DdServerApiByWeb.prototype.saveOrUpdateResourceCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/res-cate-save', category, 'POST')];
            });
        });
    };
    /**
     * ??????id??????????????????
     * @param category  ????????????, ???????????????id??????
     * @constructor
     */
    DdServerApiByWeb.prototype.deleteResourceCategoryById = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/res-cate-delete', category, 'DELETE')];
            });
        });
    };
    /**
     * ????????????????????????????????????
     * @param name  ?????????
     * @constructor
     */
    DdServerApiByWeb.prototype.findResCategoryListByNameLike = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/res/like-list', { name: name })];
            });
        });
    };
    /**
     * ??????????????????
     * @param model ResourceModel ????????????
     * @constructor
     */
    DdServerApiByWeb.prototype.saveOrUpdateResourcesModel = function (model) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/resource-save', model, 'POST')];
            });
        });
    };
    /**
     * ??????????????????
     * @param page  ?????????
     * @param pageSize ????????????
     * @param name  ????????????
     */
    DdServerApiByWeb.prototype.getTextList = function (page, pageSize, name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT("/api/text/list", {
                        page: page,
                        pageSize: pageSize,
                        name: name
                    })];
            });
        });
    };
    /**
     * ????????????????????????
     * @param text  ????????????
     */
    DdServerApiByWeb.prototype.saveText = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/text-update', text, 'POST')];
            });
        });
    };
    /**
     * ??????id??????????????????,?????????????????????
     * @param id ??????
     */
    DdServerApiByWeb.prototype.deleteTextById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/text-delete', { id: id }, 'DELETE')];
            });
        });
    };
    /**
     * ??????????????????
     * @param page  ?????????
     * @param pageSize ??????????????????
     */
    DdServerApiByWeb.prototype.getBlogList = function (page, pageSize) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/list?page=' + page + '&pageSize=' + pageSize)];
            });
        });
    };
    /**
     * ????????????????????????
     */
    DdServerApiByWeb.prototype.getArchives = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT("/api/blog/statistics")];
            });
        });
    };
    /**
     * ????????????????????????????????????
     * @param alias ????????????
     */
    DdServerApiByWeb.prototype.getBlogWithAlias = function (alias) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT("/api/blog/alias?alias=" + alias)];
            });
        });
    };
    /**
     *
     * ??????????????????
     * @param name ??????
     * @returns
     */
    DdServerApiByWeb.prototype.getTextByName = function (name, password) {
        if (password === void 0) { password = ''; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT("/api/blog/text", { password: password, name: name }, 'GET')];
            });
        });
    };
    /**
     * ????????????id ??????????????????
     * @param tagId ??????id
     * @param pageModel ????????????
     */
    DdServerApiByWeb.prototype.getBlogsByTagId = function (tagId, pageModel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/tag/blogs', Object.assign({ tagId: tagId }, pageModel))];
            });
        });
    };
    /**
     * ????????????id ??????????????????
     * @param categoryId    ??????id
     * @param pageModel ????????????
     */
    DdServerApiByWeb.prototype.getBlogsByCategoryId = function (categoryId, pageModel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/category/blogs', Object.assign({ categoryId: categoryId }, pageModel))];
            });
        });
    };
    /**
     * ??????????????????????????????????????????
     * @param month ??????
     * @param pageModel ????????????
     */
    DdServerApiByWeb.prototype.getBlogsByMonth = function (month, pageModel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/month/blogs', Object.assign({ month: month }, pageModel))];
            });
        });
    };
    /**
     * ??????????????????
     * @param type ??????????????? ??????????????? 1
     */
    DdServerApiByWeb.prototype.getPics = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/pic/list', { 'type': type })];
            });
        });
    };
    /**
     * ????????????
     * data ??????????????????
     * ???????????????????????????
     * @param loginName ?????????
     * @param password  ??????
     * @param pic   ??????
     */
    DdServerApiByWeb.prototype.register = function (loginName, password, pic) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/user-addnew', {
                        'loginNumber': loginName,
                        'password': password,
                        'picture': pic
                    }, 'POST')];
            });
        });
    };
    /**
     * ??????????????????
     * @param user ???????????????????????????
     */
    DdServerApiByWeb.prototype.updateUserProfile = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/u/update-profile', user, 'POST')];
            });
        });
    };
    /**
     * ??????flutter????????????
     * @param name  ?????????
     */
    DdServerApiByWeb.prototype.getFlutterPluginInfo = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/text/flutter-flugin', { 'name': name }, 'GET')];
            });
        });
    };
    /**
     * ????????????????????????????????????
     * ??????????????????????????????????????????????????????
     * @param params ????????????
     * @returns ???????????????????????????
     */
    DdServerApiByWeb.prototype.saveFriendsLink = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/friend/save', params, 'POST')];
            });
        });
    };
    /**
     * ??????????????????
     * @param params ????????????
     * @returns ????????????
     */
    DdServerApiByWeb.prototype.getFriends = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/friend/list', params, 'GET')];
            });
        });
    };
    /**
     * ???????????????????????????????????????,??????????????????
     * @param name ?????????
     * @returns ????????????
     */
    DdServerApiByWeb.prototype.findBlogCategoryByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/blog/category/findByName', { name: name }, 'GET')];
            });
        });
    };
    /**
     *
     * ?????????????????????????????????
     * ???????????????
     * 1. id????????????
     * 2. ?????????????????????
     * @param params ?????????????????????
     * @returns
     */
    DdServerApiByWeb.prototype.updateFriendsObject = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/update-friends-obj', params, 'POST')];
            });
        });
    };
    /**
     * ??????????????????
     * @param id ???????????????????????????ID
     * @returns ????????????
     */
    DdServerApiByWeb.prototype.deleteFriendObject = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/delete-friends-obj', { id: id }, 'DELETE')];
            });
        });
    };
    /**
     * ???????????????????????????
     * ??????
     * 1.?????????????????????????????????
     * 2.??????????????????????????????
     * @param email ???????????????
     * @param title ??????
     * @param content ????????????
     * @param html ?????????html??????
     * @returns ?????????????????????
     */
    DdServerApiByWeb.prototype.sendEmail = function (email, title, content, html) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/send-email', { email: email, title: title, content: content, html: html }, 'POST')];
            });
        });
    };
    /**
     * ????????????
     * @param data ??????
     * @returns
     */
    DdServerApiByWeb.prototype.publishPost = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/resource/add-post', data, 'POST', 'form')];
            });
        });
    };
    /**
     * ??????????????????
     * @param id    ??????ID
     * @returns
     */
    DdServerApiByWeb.prototype.deleteResource = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/resource/delete', { id: id }, 'DELETE')];
            });
        });
    };
    /**
     * ????????????????????????
     * @param params ????????????
     * @returns ???????????????????????????
     */
    DdServerApiByWeb.prototype.getResourceCategory = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/res/find', params, 'GET')];
            });
        });
    };
    /**
     * ???????????????????????????
     * @param id ??????ID
     */
    DdServerApiByWeb.prototype.getResourceSubObject = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/res/sub', { id: id }, 'GET')];
            });
        });
    };
    /**
     * ?????????????????????
     * ?????????????????????
     * @param file ???????????????
     */
    DdServerApiByWeb.prototype.uploadFileWithSingle = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/simple-upload', file, 'POST')];
            });
        });
    };
    /**
     * ???????????????????????????,????????????
     * @param params ?????? [CreateOrUpdateDocDirectoryParam]
     */
    DdServerApiByWeb.prototype.createOrUpdateDocDirectory = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/cate-director-action', params, 'POST')];
            });
        });
    };
    /**
     *
     * ???????????????
     * ??????????????????????????????token
     * ?????????????????????????????????
     * @param selectKey ??????????????????
     * @returns ??????????????????
     */
    DdServerApiByWeb.prototype.adminSelectTextOriginPassword = function (selectKey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/auth/text/origin-password-select', { 'key': selectKey }, 'GET')];
            });
        });
    };
    /**
     * ????????????ResourceCategory??????????????????
     */
    DdServerApiByWeb.prototype.getResourceCategoryTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/rc/types', {}, 'GET')];
            });
        });
    };
    /**
     * ?????????????????????
     * @param pageParam ????????????,??????
     * @param selectParams ??????????????????, ??????
     */
    DdServerApiByWeb.prototype.getVersionList = function (pageParam, selectParams) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.requestT('/api/version/list', Object.assign(pageParam, selectParams), 'GET')];
            });
        });
    };
    return DdServerApiByWeb;
}());
exports["default"] = DdServerApiByWeb;
