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
to boot an application in order to boot it.

### Booting a migrated app

The best path forward is to run the
[ember-module-unification-blueprint](https://github.com/emberjs/ember-module-unification-blueprint)
on the converted app:

```sh
# This command will run the blueprint, but it requires Ember-CLI 2.14.
#
# You may want to manually update the following packages before running the
# `ember init` command:
#
#   npm i ember-resolver@^4.3.0 ember-cli@github:ember-cli/ember-cli --save-dev
#   npm uninstall ember-source --save
#   bower install --save components/ember#canary
#
# If you are already running 2.14, you can jump right to the command:
ember init -b ember-module-unification-blueprint
```
Additionally any component names not in a template are not recognized by the
migrator. For example if you have a computed property that returns the
string `"widget/some-thing"` using that string with the `{{component` helper
will now cause an error. You must convert these component named to not have `/`
characters in their strings.

### Running module unification with fallback to classic app layout

If an application cannot be converted all at once, or if your application is
dependent upon addons that use `app/` to add files, you may want to use
a setup that falls back to `app/` after checking `src` and honors the `app/`
directory for some files like initializers.

To do this use a fallback resolver in `src/resolver.js`:

```js
import Resolver from 'ember-resolver/resolvers/fallback';
import buildResolverConfig from 'ember-resolver/ember-config';
import config from '../config/environment';

let moduleConfig = buildResolverConfig(config.modulePrefix);
/*
 * If your application has custom types and collections, modify moduleConfig here
 * to add support for them.
 */

export default Resolver.extend({
  config: moduleConfig
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
