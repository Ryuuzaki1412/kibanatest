"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createEsIndexRoute", {
  enumerable: true,
  get: function () {
    return _create_index_route.createEsIndexRoute;
  }
});
Object.defineProperty(exports, "createPrebuiltSavedObjectsRoute", {
  enumerable: true,
  get: function () {
    return _create_prebuilt_saved_objects.createPrebuiltSavedObjectsRoute;
  }
});
Object.defineProperty(exports, "createStoredScriptRoute", {
  enumerable: true,
  get: function () {
    return _create_script_route.createStoredScriptRoute;
  }
});
Object.defineProperty(exports, "deleteEsIndicesRoute", {
  enumerable: true,
  get: function () {
    return _delete_indices_route.deleteEsIndicesRoute;
  }
});
Object.defineProperty(exports, "deletePrebuiltSavedObjectsRoute", {
  enumerable: true,
  get: function () {
    return _delete_prebuilt_saved_objects.deletePrebuiltSavedObjectsRoute;
  }
});
Object.defineProperty(exports, "deleteStoredScriptRoute", {
  enumerable: true,
  get: function () {
    return _delete_script_route.deleteStoredScriptRoute;
  }
});
Object.defineProperty(exports, "getRiskScoreIndexStatusRoute", {
  enumerable: true,
  get: function () {
    return _index_status.getRiskScoreIndexStatusRoute;
  }
});
Object.defineProperty(exports, "installRiskScoresRoute", {
  enumerable: true,
  get: function () {
    return _install_risk_scores.installRiskScoresRoute;
  }
});
Object.defineProperty(exports, "readPrebuiltDevToolContentRoute", {
  enumerable: true,
  get: function () {
    return _read_prebuilt_dev_tool_content_route.readPrebuiltDevToolContentRoute;
  }
});
var _create_index_route = require("../indices/create_index_route");
var _delete_indices_route = require("../indices/delete_indices_route");
var _read_prebuilt_dev_tool_content_route = require("../prebuilt_dev_tool_content/routes/read_prebuilt_dev_tool_content_route");
var _create_prebuilt_saved_objects = require("../prebuilt_saved_objects/routes/create_prebuilt_saved_objects");
var _delete_prebuilt_saved_objects = require("../prebuilt_saved_objects/routes/delete_prebuilt_saved_objects");
var _create_script_route = require("../stored_scripts/create_script_route");
var _delete_script_route = require("../stored_scripts/delete_script_route");
var _index_status = require("../index_status");
var _install_risk_scores = require("../onboarding/routes/install_risk_scores");