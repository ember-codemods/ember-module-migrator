module.exports = function(collection) {
  switch(collection) {
  case 'models':
    return 'model';

  case 'components':
    return 'component';

  case 'initializers':
    return 'initializer';

  case 'instance-initializers':
    return 'instance-initializer';

  //case 'partials':
  //  return 'partial';

  case 'routes':
    return 'route';

  case 'services':
    return 'service';

  case 'transforms':
    return 'transform';

  case 'utils':
    return 'util';

  default:
    return null;
  }
};
