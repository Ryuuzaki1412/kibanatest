"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyConfigOverrides = applyConfigOverrides;
exports.default = _default;
var _saferLodashSet = require("@kbn/safer-lodash-set");
var _lodash = _interopRequireDefault(require("lodash"));
var _path = require("path");
var _url = _interopRequireDefault(require("url"));
var _repoInfo = require("@kbn/repo-info");
var _read_keystore = require("../keystore/read_keystore");
var _compile_config_stack = require("./compile_config_stack");
var _config = require("@kbn/config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

const DEV_MODE_PATH = '@kbn/cli-dev-mode';
const DEV_MODE_SUPPORTED = canRequire(DEV_MODE_PATH);
function canRequire(path) {
  try {
    require.resolve(path);
    return true;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return false;
    } else {
      throw error;
    }
  }
}
const getBootstrapScript = isDev => {
  if (DEV_MODE_SUPPORTED && isDev && process.env.isDevCliChild !== 'true') {
    // need dynamic require to exclude it from production build
    // eslint-disable-next-line import/no-dynamic-require
    const {
      bootstrapDevMode
    } = require(DEV_MODE_PATH);
    return bootstrapDevMode;
  } else {
    const {
      bootstrap
    } = require('@kbn/core/server');
    return bootstrap;
  }
};
const setServerlessKibanaDevServiceAccountIfPossible = (get, set, opts) => {
  const esHosts = [].concat(get('elasticsearch.hosts', []), opts.elasticsearch ? opts.elasticsearch.split(',') : []);

  /*
   * We only handle the service token if serverless ES is running locally.
   * Example would be if the user is running SES in the cloud and KBN serverless
   * locally, they would be expected to handle auth on their own and this token
   * is likely invalid anyways.
   */
  const isESlocalhost = esHosts.length ? esHosts.some(hostUrl => {
    const parsedUrl = _url.default.parse(hostUrl);
    return parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1' || parsedUrl.hostname === 'host.docker.internal';
  }) : true; // default is localhost:9200

  if (!opts.dev || !opts.serverless || !isESlocalhost) {
    return;
  }
  const DEV_UTILS_PATH = '@kbn/dev-utils';
  if (!canRequire(DEV_UTILS_PATH)) {
    return;
  }

  // need dynamic require to exclude it from production build
  // eslint-disable-next-line import/no-dynamic-require
  const {
    kibanaDevServiceAccount
  } = require(DEV_UTILS_PATH);
  set('elasticsearch.serviceAccountToken', kibanaDevServiceAccount.token);
};
function pathCollector() {
  const paths = [];
  return function (path) {
    paths.push((0, _path.resolve)(process.cwd(), path));
    return paths;
  };
}
const configPathCollector = pathCollector();
const pluginPathCollector = pathCollector();
function applyConfigOverrides(rawConfig, opts, extraCliOptions) {
  const set = _lodash.default.partial(_saferLodashSet.set, rawConfig);
  const get = _lodash.default.partial(_lodash.default.get, rawConfig);
  const has = _lodash.default.partial(_lodash.default.has, rawConfig);
  if (opts.oss) {
    delete rawConfig.xpack;
  }

  // only used to set cliArgs.envName, we don't want to inject that into the config
  delete extraCliOptions.env;
  if (opts.dev) {
    if (opts.serverless) {
      setServerlessKibanaDevServiceAccountIfPossible(get, set, opts);

      // Load mock identity provider plugin and configure realm if supported (ES only supports SAML when run with SSL)
      if (opts.ssl && canRequire('@kbn/mock-idp-plugin/common')) {
        // Ensure the plugin is loaded in dynamically to exclude from production build
        const {
          MOCK_IDP_PLUGIN_PATH,
          MOCK_IDP_REALM_NAME
        } = require('@kbn/mock-idp-plugin/common');
        if (has('server.basePath')) {
          console.log(`Custom base path is not supported when running in Serverless, it will be removed.`);
          _lodash.default.unset(rawConfig, 'server.basePath');
        }
        set('plugins.paths', _lodash.default.compact([].concat(get('plugins.paths'), MOCK_IDP_PLUGIN_PATH)));
        set(`xpack.security.authc.providers.saml.${MOCK_IDP_REALM_NAME}`, {
          order: Number.MAX_SAFE_INTEGER,
          realm: MOCK_IDP_REALM_NAME,
          icon: 'user',
          description: 'Continue as Test User',
          hint: 'Allows testing serverless user roles'
        });
        // Add basic realm since defaults won't be applied when a provider has been configured
        if (!has('xpack.security.authc.providers.basic')) {
          set('xpack.security.authc.providers.basic.basic', {
            order: 0,
            enabled: true
          });
        }
      }
    }
    if (!has('elasticsearch.serviceAccountToken') && opts.devCredentials !== false) {
      if (!has('elasticsearch.username')) {
        set('elasticsearch.username', 'kibana_system');
      }
      if (!has('elasticsearch.password')) {
        set('elasticsearch.password', 'changeme');
      }
    }
    if (opts.ssl) {
      // @kbn/dev-utils is part of devDependencies
      // eslint-disable-next-line import/no-extraneous-dependencies
      const {
        CA_CERT_PATH,
        KBN_KEY_PATH,
        KBN_CERT_PATH
      } = require('@kbn/dev-utils');
      const customElasticsearchHosts = opts.elasticsearch ? opts.elasticsearch.split(',') : [].concat(get('elasticsearch.hosts') || []);
      function ensureNotDefined(path) {
        if (has(path)) {
          throw new Error(`Can't use --ssl when "${path}" configuration is already defined.`);
        }
      }
      ensureNotDefined('server.ssl.certificate');
      ensureNotDefined('server.ssl.key');
      ensureNotDefined('server.ssl.keystore.path');
      ensureNotDefined('server.ssl.truststore.path');
      ensureNotDefined('server.ssl.certificateAuthorities');
      ensureNotDefined('elasticsearch.ssl.certificateAuthorities');
      const elasticsearchHosts = (customElasticsearchHosts.length > 0 && customElasticsearchHosts || ['https://localhost:9200']).map(hostUrl => {
        const parsedUrl = _url.default.parse(hostUrl);
        if (parsedUrl.hostname !== 'localhost') {
          throw new Error(`Hostname "${parsedUrl.hostname}" can't be used with --ssl. Must be "localhost" to work with certificates.`);
        }
        return `https://localhost:${parsedUrl.port}`;
      });
      set('server.ssl.enabled', true);
      set('server.ssl.certificate', KBN_CERT_PATH);
      set('server.ssl.key', KBN_KEY_PATH);
      set('server.ssl.certificateAuthorities', CA_CERT_PATH);
      set('elasticsearch.hosts', elasticsearchHosts);
      set('elasticsearch.ssl.certificateAuthorities', CA_CERT_PATH);
    }
  }
  if (opts.elasticsearch) set('elasticsearch.hosts', opts.elasticsearch.split(','));
  if (opts.port) set('server.port', opts.port);
  if (opts.host) set('server.host', opts.host);
  if (opts.silent) {
    set('logging.root.level', 'off');
  }
  if (opts.verbose) {
    set('logging.root.level', 'all');
  }
  set('plugins.paths', _lodash.default.compact([].concat(get('plugins.paths'), opts.pluginPath)));
  _lodash.default.mergeWith(rawConfig, extraCliOptions, mergeAndReplaceArrays);
  _lodash.default.merge(rawConfig, (0, _read_keystore.readKeystore)());
  return rawConfig;
}
function _default(program) {
  const command = program.command('serve');
  command.description('Run the kibana server').collectUnknownOptions().option('-e, --elasticsearch <uri1,uri2>', 'Elasticsearch instances').option('-c, --config <path>', 'Path to the config file, use multiple --config args to include multiple config files', configPathCollector, []).option('-p, --port <port>', 'The port to bind to', parseInt).option('-Q, --silent', 'Set the root logger level to off').option('--verbose', 'Set the root logger level to all').option('-H, --host <host>', 'The host to bind to').option('-l, --log-file <path>', 'Deprecated, set logging file destination in your configuration').option('--plugin-path <path>', 'A path to a plugin which should be included by the server, ' + 'this can be specified multiple times to specify multiple paths', pluginPathCollector, []).option('--optimize', 'Deprecated, running the optimizer is no longer required');
  if (!(0, _repoInfo.isKibanaDistributable)()) {
    command.option('--oss', 'Start Kibana without X-Pack').option('--run-examples', 'Adds plugin paths for all the Kibana example plugins and runs with no base path').option('--serverless [oblt|security|es]', 'Start Kibana in a specific serverless project mode. ' + 'If no mode is provided, it starts Kibana in the most recent serverless project mode (default is es)');
  }
  if (DEV_MODE_SUPPORTED) {
    command.option('--dev', 'Run the server with development mode defaults').option('--ssl', 'Run the dev server using HTTPS').option('--dist', 'Use production assets from kbn/optimizer').option('--no-base-path', "Don't put a proxy in front of the dev server, which adds a random basePath").option('--no-watch', 'Prevents automatic restarts of the server in --dev mode').option('--no-optimizer', 'Disable the kbn/optimizer completely').option('--no-cache', 'Disable the kbn/optimizer cache').option('--no-dev-config', 'Prevents loading the kibana.dev.yml file in --dev mode').option('--no-dev-credentials', 'Prevents setting default values for `elasticsearch.username` and `elasticsearch.password` in --dev mode');
  }
  command.action(async function (opts) {
    const unknownOptions = this.getUnknownOptions();
    const configs = (0, _compile_config_stack.compileConfigStack)({
      configOverrides: opts.config,
      devConfig: opts.devConfig,
      dev: opts.dev,
      serverless: opts.serverless || unknownOptions.serverless
    });
    const configsEvaluted = (0, _config.getConfigFromFiles)(configs);
    const isServerlessMode = !!(configsEvaluted.serverless || opts.serverless || unknownOptions.serverless);
    const cliArgs = {
      dev: !!opts.dev,
      envName: unknownOptions.env ? unknownOptions.env.name : undefined,
      silent: !!opts.silent,
      verbose: !!opts.verbose,
      watch: !!opts.watch,
      runExamples: !!opts.runExamples,
      // We want to run without base path when the `--run-examples` flag is given so that we can use local
      // links in other documentation sources, like "View this tutorial [here](http://localhost:5601/app/tutorial/xyz)".
      // We can tell users they only have to run with `yarn start --run-examples` to get those
      // local links to work.  Similar to what we do for "View in Console" links in our
      // elastic.co links.
      // We also want to run without base path when running in serverless mode so that Elasticsearch can
      // connect to Kibana's mock identity provider.
      basePath: opts.runExamples || isServerlessMode ? false : !!opts.basePath,
      optimize: !!opts.optimize,
      disableOptimizer: !opts.optimizer,
      oss: !!opts.oss,
      cache: !!opts.cache,
      dist: !!opts.dist,
      serverless: isServerlessMode
    };

    // In development mode, the main process uses the @kbn/dev-cli-mode
    // bootstrap script instead of core's. The DevCliMode instance
    // is in charge of starting up the optimizer, and spawning another
    // `/script/kibana` process with the `isDevCliChild` varenv set to true.
    // This variable is then used to identify that we're the 'real'
    // Kibana server process, and will be using core's bootstrap script
    // to effectively start Kibana.
    const bootstrapScript = getBootstrapScript(cliArgs.dev);
    await bootstrapScript({
      configs,
      cliArgs,
      applyConfigOverrides: rawConfig => applyConfigOverrides(rawConfig, opts, unknownOptions)
    });
  });
}
function mergeAndReplaceArrays(objValue, srcValue) {
  if (typeof srcValue === 'undefined') {
    return objValue;
  } else if (Array.isArray(srcValue)) {
    // do not merge arrays, use new value instead
    return srcValue;
  } else {
    // default to default merging
    return undefined;
  }
}