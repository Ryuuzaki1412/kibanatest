"use strict";

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

// The following require statements MUST be executed before any others - BEGIN
require('./exit_on_warning');
require('./harden');
// The following require statements MUST be executed before any others - END

// @todo Remove when migrated to Node 20 (#162696)
require('./heap_snapshot');
require('symbol-observable');
require('source-map-support').install();
require('./node_version_validator');
require('./openssl_legacy_provider');