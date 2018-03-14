function transformer(file, api) {
  var j = api.jscodeshift;

  var foundHelper = false;

  var root = j(file.source);

  // Replaces:
  //   import { helper } from '@ember/component/helper';
  // With:
  //   import { helper as buildHelper } from '@ember/component/helper';
  root.find(j.ImportDeclaration, {
    source: { value: '@ember/component/helper' },
  }).filter(path => {
    return path.value.specifiers[0].local.name === 'helper';
  })
  .forEach(function(path) {
    foundHelper = true;
    var specifier = j.importSpecifier(
      j.identifier('helper'),
      j.identifier('buildHelper')
    );

    path.value.specifiers[0] = specifier;
  });
  
  // Replace helper(...) with buildHelper(...)
  if (foundHelper) {
    root.find(j.CallExpression, {
      callee: { name: 'helper' }      
    }).forEach(path => {
      path.value.callee.name = 'buildHelper';
    });
  }

  return root.toSource();
}

module.exports = transformer;
