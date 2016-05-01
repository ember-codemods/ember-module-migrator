var inflection = require('inflection');

var PLURAL_OVERRIDES = {
  'mirage': 'mirage',
  'html': 'html'
};

module.exports = function(type) {
  var pluralizedType = inflection.pluralize(type, PLURAL_OVERRIDES[type]);
  var collection, collectionGroup;

  switch (type) {
  case 'service':
    collection = 'services';
    collectionGroup = '';
    break;

  case 'util':
  case 'mixin':
    collection = 'utils';
    collectionGroup = '';
    break;

  case 'authenticator':
  case 'authorizer':
  case 'session-store':
    collection = pluralizedType;
    collectionGroup = 'simple-auth';
    break;

  case 'adapter':
  case 'serializer':
  case 'model':
    collection = 'models';
    collectionGroup = 'data';
    break;

  case 'transform':
    collection = 'transforms';
    collectionGroup = 'data';
    break;

  case 'view':
  case 'route':
  case 'controller':
  case 'template':
    collection = 'routes';
    collectionGroup = 'ui';
    break;

  case 'helper':
  case 'component':
    collection = 'components';
    collectionGroup = 'ui';
    break;

  case 'style':
    collection = 'styles';
    collectionGroup = 'ui';
    break;

  case 'initializer':
  case 'instance-initializer':
    collection = pluralizedType;
    collectionGroup = 'init';
    break;

  default:
    collection = pluralizedType;
    collectionGroup = '';
  }

  return {
    collection: collection,
    collectionGroup: collectionGroup
  };
};
