"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSAL = void 0;
var msal = __importStar(require("@azure/msal-browser"));
var MSAL = /** @class */ (function () {
    function MSAL(options) {
        this.tokenExpirationTimers = {};
        this.data = {
            isAuthenticated: false,
            accessToken: '',
            idToken: '',
            user: { name: '', userName: '' },
            custom: {},
            account: {
                localAccountId: "",
                homeAccountId: "",
                username: "",
                name: "",
                // idToken: {},
                idTokenClaims: {},
                // sid: "",
                environment: "",
                tenantId: ""
            }
        };
        // Config object to be passed to Msal on creation.
        // For a full list of msal.js configuration parameters, 
        // visit https://azuread.github.io/microsoft-authentication-library-for-js/docs/msal/modules/_authenticationparameters_.html
        this.auth = {
            clientId: "",
            authority: "",
            redirectUri: "",
            onAuthentication: function (error, response) { },
            onToken: function (error, response) { },
            beforeSignOut: function () { }
        };
        this.cache = {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        };
        // Add here scopes for id token to be used at MS Identity Platform endpoints.
        this.loginRequest = {
            scopes: ["openid", "profile", "User.Read"]
        };
        // Add here scopes for access token to be used at MS Graph API endpoints.
        this.tokenRequest = {
            scopes: ["User.Read"]
        };
        if (!options.auth.clientId) {
            throw new Error('auth.clientId is required');
        }
        this.auth = Object.assign(this.auth, options.auth);
        this.cache = Object.assign(this.cache, options.cache);
        this.loginRequest = Object.assign(this.loginRequest, options.loginRequest);
        this.tokenRequest = Object.assign(this.tokenRequest, options.tokenRequest);
        var config = {
            auth: this.auth,
            cache: this.cache
        };
        this.msalLibrary = new msal.PublicClientApplication(config);
        this.signIn();
    }
    MSAL.prototype.signIn = function () {
        var _this = this;
        return this.msalLibrary.loginRedirect(this.loginRequest).then(function (loginResponse) {
            if (loginResponse !== null) {
                _this.data.user.userName = loginResponse.account.username;
                _this.data.accessToken = loginResponse.accessToken;
                _this.data.idToken = loginResponse.idToken;
                _this.data.account = loginResponse.account;
            }
            else {
                // need to call getAccount here?
                var currentAccounts = _this.msalLibrary.getAllAccounts();
                console.log('all accounts: ');
                console.log(currentAccounts);
                if (currentAccounts === null) {
                    return;
                }
                else if (currentAccounts.length > 1) {
                    // Add choose account code here
                }
                else if (currentAccounts.length === 1) {
                    _this.data.user.userName = currentAccounts[0].username;
                    _this.data.user.userName = currentAccounts[0].name;
                    console.log('this.data: ');
                    console.log(_this.data);
                }
            }
        }).catch(function (error) {
            console.log(error);
        });
    };
    MSAL.prototype.signOut = function () {
        var logoutRequest = {
            account: this.msalLibrary.getAccountByUsername(this.data.user.userName)
        };
        this.msalLibrary.logout(logoutRequest);
        this.data.accessToken = "";
        this.data.idToken = "";
        this.data.user.userName = "";
    };
    MSAL.prototype.acquireToken = function (request, retries) {
        if (request === void 0) { request = this.loginRequest; }
        if (retries === void 0) { retries = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loginRequest.account = this.data.account;
                        console.log('in acquireToken! retries: ' + retries);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 7]);
                        return [4 /*yield*/, this.msalLibrary.acquireTokenSilent(request)];
                    case 2:
                        response = _a.sent();
                        this.handleTokenResponse(null, response);
                        return [3 /*break*/, 7];
                    case 3:
                        error_1 = _a.sent();
                        console.log("silent token acquisition fails.");
                        if (!(error_1 instanceof msal.InteractionRequiredAuthError)) return [3 /*break*/, 4];
                        console.log("acquiring token using popup");
                        return [2 /*return*/, this.msalLibrary.acquireTokenPopup(request).catch(function (error) {
                                console.error(error);
                            })];
                    case 4:
                        if (!(retries > 0)) return [3 /*break*/, 6];
                        console.log('in acquireToken with retries: ' + retries);
                        return [4 /*yield*/, new Promise(function (resolve) {
                                console.log('setting timeout 5 seconds');
                                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                    var res;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, this.acquireToken(request, retries - 1)];
                                            case 1:
                                                res = _a.sent();
                                                resolve(res);
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, 5 * 1000);
                            })];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [2 /*return*/, false];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MSAL.prototype.isAuthenticated = function () {
        if (this.msalLibrary.getAllAccounts() === null) {
            return false;
        }
        else {
            return true;
        }
    };
    MSAL.prototype.handleTokenResponse = function (error, response) {
        if (error) {
            return;
        }
        if (this.data.accessToken !== response.accessToken) {
            this.setToken('accessToken', response.accessToken, response.expiresOn, response.scopes);
            console.log('got new accessToken: ' + response.accessToken);
        }
        if (this.data.idToken !== response.idToken.rawIdToken) {
            this.setToken('idToken', response.idToken.rawIdToken, new Date(response.idToken.expiration * 1000), [this.auth.clientId]);
            console.log('got new idToken: ' + response.idToken.rawIdToken);
        }
    };
    MSAL.prototype.setToken = function (tokenType, token, expiresOn, scopes) {
        var _this = this;
        var expirationOffset = 10000000;
        var expiration = expiresOn.getTime() - (new Date()).getTime() - expirationOffset;
        console.log('set token: ' + expiration);
        if (expiration >= 0) {
            console.log('setting token: ' + tokenType + " with val: " + token);
            this.data[tokenType] = token;
        }
        if (this.tokenExpirationTimers[tokenType])
            clearTimeout(this.tokenExpirationTimers[tokenType]);
        this.tokenExpirationTimers[tokenType] = window.setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('auto refreshing token: ' + this.auth.autoRefreshToken);
                        if (!this.auth.autoRefreshToken) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.acquireToken({ scopes: scopes }, 3)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        this.data[tokenType] = '';
                        console.log('setting token to none:' + this.data.accessToken);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); }, expiration);
    };
    return MSAL;
}());
exports.MSAL = MSAL;
//# sourceMappingURL=main.js.map