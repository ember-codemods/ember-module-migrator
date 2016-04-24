# ember-module-migrator

Migrates ember-cli projects to the newly proposed module format.

See RFC for details.

## Important Note

Running this migrator on your application will migrate to the new structure being proposed, however at this time that structure is not fully bootable from ember-cli.  The goal right now, is for the tool to help guide us in the best module layout and for folks to be able to get a feel for what their projects will look like when things are ready to go.

### Usage

```sh
npm install -g ember-module-migrator
cd your/project/path
ember-module-migrator
```
