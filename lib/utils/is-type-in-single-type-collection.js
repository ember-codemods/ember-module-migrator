module.exports = function(type) {
  switch (type) {
    // data
  case 'adapter':
  case 'serializer':
  case 'model':
    return false;

    // routes
  case 'route':
  case 'controller':
  case 'template':
    return false;

    // components
  case 'component':
    return false;

  default:
    return true;
  }
};
