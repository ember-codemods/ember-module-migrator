
const podFileTypes = [
  'component',
  'template',
  'controller',
  'route',
  'model',
  'adapter',
  'serializer'
];

function typeForPodFile(path) {
  const parts = path.split('/');
  const fileName = parts[parts.length - 1];

  const type = podFileTypes.find(f => fileName.startsWith(f));

  return type;
}

function hasPodNamespace(namespace) {
  return (
    namespace !== undefined &&
    namespace !== null &&
    namespace !== ''
  );
}

module.exports = {
  typeForPodFile,
  hasPodNamespace
};
