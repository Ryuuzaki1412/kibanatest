"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "KIBANA_ADMIN_ROLE_NAME", {
  enumerable: true,
  get: function () {
    return _kibana_user_role.KIBANA_ADMIN_ROLE_NAME;
  }
});
Object.defineProperty(exports, "KIBANA_USER_ROLE_NAME", {
  enumerable: true,
  get: function () {
    return _kibana_user_role.KIBANA_USER_ROLE_NAME;
  }
});
Object.defineProperty(exports, "getPrivilegeDeprecationsService", {
  enumerable: true,
  get: function () {
    return _privilege_deprecations.getPrivilegeDeprecationsService;
  }
});
Object.defineProperty(exports, "registerKibanaUserRoleDeprecation", {
  enumerable: true,
  get: function () {
    return _kibana_user_role.registerKibanaUserRoleDeprecation;
  }
});
var _privilege_deprecations = require("./privilege_deprecations");
var _kibana_user_role = require("./kibana_user_role");