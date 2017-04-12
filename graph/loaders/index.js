const _ = require('lodash');
const debug = require('debug')('talk:graph:loaders');

const Actions = require('./actions');
const Assets = require('./assets');
const Comments = require('./comments');
const Metrics = require('./metrics');
const Settings = require('./settings');
const Users = require('./users');
const relayLoaders = require('../relay/loaders');

const plugins = require('../../services/plugins');

let loaders = [

  // Load the core loaders.
  Actions,
  Assets,
  Comments,
  Metrics,
  Settings,
  Users,

  // Load the plugin loaders from the manager.
  ...plugins
    .get('server', 'loaders').map(({plugin, loaders}) => {
      debug(`added plugin '${plugin.name}'`);

      return loaders;
    }),
  ...relayLoaders,
];

/**
 * Creates a set of loaders based on a GraphQL context.
 * @param  {Object} context the context of the GraphQL request
 * @return {Object}         object of loaders
 */
module.exports = (context) => {

  // We need to return an object to be accessed.
  return _.merge(...loaders.map((loaders) => {

    // Each loader is a function which takes the context.
    return loaders(context);
  }));
};
