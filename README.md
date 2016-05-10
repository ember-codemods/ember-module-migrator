# ember-module-migrator

Migrates ember-cli projects to the newly proposed module format.

See [emberjs/rfcs#143](https://github.com/emberjs/rfcs/pull/143) for details.

## Examples

* [Ghost admin client](https://github.com/rwjblue/--ghost-modules-sample/tree/grouped-collections/src)
* [Travis client](https://github.com/rwjblue/--travis-modules-sample/tree/modules/src)
* [`ember new my-app`](https://github.com/rwjblue/--new-app-blueprint/tree/modules/src)

### Usage

```sh
npm install -g ember-module-migrator
cd your/project/path
ember-module-migrator
```

### Important Notes

Running this migrator on your application will migrate to the new structure being proposed, however at this time that structure is not fully bootable from ember-cli.  The goal right now, is for the tool to help guide us in the best module layout and for folks to be able to get a feel for what their projects will look like when things are ready to go.

Known caveats:

* Migrates only "classic" structured ember-cli apps at this point. We are actively working on pods support.
* Leaves the migrated app in a non-bootable state. This is because changes are needed to ember-cli to allow the application to boot, but those changes haven't started yet.
