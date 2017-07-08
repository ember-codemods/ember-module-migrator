# ember-module-migrator

Migrates ember-cli projects to the newly proposed module format.

This migrator does not leave an application in a bootable state. See "Usage"
for instructions on how to manually update a migrated app to a bootable
setup.

See [emberjs/rfcs#143](https://github.com/emberjs/rfcs/pull/143) for details
on the design of this app layout.

### Examples

These are examples of the migrator output on various apps:

* [Ghost admin client](https://github.com/rwjblue/--ghost-modules-sample/tree/grouped-collections/src)
* [Travis client](https://github.com/rwjblue/--travis-modules-sample/tree/modules/src)
* [Migration of `ember new my-app`](https://github.com/rwjblue/--new-app-blueprint/tree/modules/src)

### Usage

To run the migrator on your app:

```sh
npm install -g ember-module-migrator jscodeshift
cd your/project/path
ember-module-migrator
```

After running the migrator itself, you will need to update several files
to boot an application. The best path forward is to run the
[ember-module-unification-blueprint](https://github.com/emberjs/ember-module-unification-blueprint)
on the converted app:

```sh
# This command will run the blueprint. Important things to note in the
# package.json and bower.json are these package changes:
#
# npm i ember-resolver@^4.2.3 ember-cli@github:ember-cli/ember-cli --save-dev
# npm uninstall ember-source --save
# bower install --save components/ember#canary
#
ember init -b ember-module-unification-blueprint
```

### Running module unification with fallback to classic app layout

If an application cannot be converted all at once, or if your application is
dependent upon addons that use `app/` to add files, you may want to use
a setup that falls back to `app/` after checking `src` and honors the `app/`
directory for some files like initializers.

To do this use a fallback resolver in `src/resolver.js`:

```js
import ClassicResolver from 'ember-resolver';
import Resolver from 'ember-resolver/resolvers/glimmer-wrapper';
import buildResolverConfig from 'ember-resolver/ember-config';
import config from '../config/environment';

export default Resolver.extend({
  config: buildResolverConfig(config.modulePrefix),
  init(options) {
    this._super(options);
    this._fallback = ClassicResolver.create(Object.assign({
      namespace: { modulePrefix: config.modulePrefix }
    }, options));
  },
  resolve(name, referrer) {
    let result = this._super(name, referrer);
    if (!result) {
      result = this._fallback.resolve(name);
    }
    return result;
  }
});
```

And in `src/main.js` be sure to load initializers in the `app/` directory
(possibly added by an addon) via:

```js
/*
 * This line should be added by the blueprint
 */
loadInitializers(App, config.modulePrefix+'/src/init');

/*
 * This line should be added to support `app/` directories
 */
loadInitializers(App, config.modulePrefix);
```

### Important Notes

Known caveats:

* Migrates only "classic" structured ember-cli apps at this point. We are
  actively working on pods support.
