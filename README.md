# crius

> A modular gulp front-end workflow originally based on the (awesome) [Sage starter theme](https://github.com/roots/sage).

With crius you can:
* Write CSS with Stylus
    * Build your website's grid with the RolleiFLEX declarative flex helper framework. (stylus)
    * Use simplified media queries with rupture (stylus)
* Write ES2017 Javascript
* See live changes (CSS/JS/HTML) on your project with [browserSync](https://www.browsersync.io/)
* Have your [bower](https://bower.io/) or npm packages automatically included in your assets
  * Check the **crius.json** on the **root** directory
* Need to manage a new type of resource, like, let's say... sounds? Just define it in the **crius.json** and let the magic happen!

## Requirements

1. [Node](https://nodejs.org/en/download/)
2. [Gulp CLI & Gulp 4](https://www.liquidlight.co.uk/blog/article/how-do-i-update-to-gulp-4/)

## Installation

1. `git clone git@github.com:kaisermann/crius.git`
2. `npm install`
3. Run at least `gulp build` before running `gulp watch`

## Documentation

### Manifest specification (crius.json)

#### [General manifest specification](https://github.com/kaisermann/asset-orchestrator/blob/master/manifest.md)

* * *

#### The `config` object

The `config.paths` object MAY have a `revisionManifest` `string` attribute that defines the revision manifest's file name on production distributions.

Defaults to:
```json
{
  "config": {
    "paths": {
      "revisionManifest": "assets.json"
    }
  }
}
```

* * *

The `config` object MAY have a `supportedBrowsers` **object** attribute defined by an array of browsers, which will be used to autoprefix a project's CSS. See [Browserslist](https://github.com/ai/browserslist#queries) docs for available names and queries.

Defaults to:
```json
{
  "config": {
    "supportedBrowsers": [
      "last 2 versions",
      "opera 12",
      "IE 10"
    ]
  }
}
```

* * *

The `config` object MUST have a `browserSync` **object** if it's planned to use browserSync.

```json
{
  "config": {
    "browserSync": {
      "mode": "proxy",
      "watchFiles": [
        "{lib,templates}/**/*.{php,html}",
        "*.{php,html}"
      ],
      "whitelist": [],
      "blacklist": [],
      "devUrl":"localhost/crius"
    }
  }
}
```

`watchFiles` is an **optional** **array** or a `string` of files to be watched by browserSync. **Do not** watch your asset files via browserSync as they are already being watched by `gulp.watch`. Defaults to `[]`.

`whitelist` and `blacklist` are each one an **optional** **array** or a `string` of supposed watched files allowed/not allowed to be watched. Defaults to `[]`.

`devUrl` is a **mandatory** `string` that specifies your projects development proxy url.

`mode` defines in which mode should browserSync be initialized. In `server` mode, it creates a temporary server for your project. In `proxy` (default) mode, it just proxies the `devUrl` to an already existing server.
* * *

#### The `resources` object

For a complete base description of the object, please see the
[General manifest specification](https://github.com/kaisermann/asset-orchestrator/blob/master/manifest.md).

```json
{
  "resources": {
    "scripts": {
      "pattern": "*.js",
      "directory": "scripts",
      "assets": {
        "main.js": {
          "files": "js/wrapper.js"
        }
      }
    }
  }
}
```

* * *

Each resource type MAY have a **directory** `string` attribute, defining where the assets are inside `config.paths.src`and where the built ones will be inside `config.paths.dist`. If not specified, the resource type name will be used.

* * *

crius **automatically** creates a gulp task for each resource. All of a resource assets will be moved from the `config.paths.source` to `config.paths.dist` without you doing anything besides defining the resource in the `crius.json`.

If a resource assets need any type of processing, a drop-in module can be created at `.crius/resource-modules/${resourceName}.js` to modify the stream with a [lazypipe](https://github.com/OverZealous/lazypipe). The file name must match the resource name.

Resource module format:
```js
const lazypipe = require('lazypipe')

module.exports = {
  // Names of tasks to be ran before the resource task
  dependencyTasks: ['nameOftaskToRunBeforeThisOne'],
  pipelines: {
    // Pipeline attached to each asset stream
    each: asset => {
      return lazypipe()
    },
    // Pipeline attached to all assets streams merged
    // Useful for manifests, etc
    merged: resourceInfo => {
      return lazypipe()
    },
  },
}
```

You can see other real examples by looking at the `.crius/resource-modules` directory.

* * *

Each CSS `asset` MAY have a **uncss** `boolean` attribute. If `true` the `uncss` task will search the file for unused selectors based on a `sitemap.json` file. The `sitemap.json` must be composed by an array of your projects pages urls.

```json
{
  "resources": {
    "styles": {
      "pattern": "*.css",
      "directory": "styles",
      "assets": {
        "main.css": {
          "uncss": true,
          "files": "styles/wrapper.styl"
        },
        "admin.css": {
          "files": "styles/admin.styl"
        }
      }
    }
  }
}
```

* * *

### Gulp Tasks

#### Out of the box tasks

* `gulp` / `gulp build` Erases distribution directory and builds all assets
* `gulp compile` Same as `gulp build` without deleting distribution directory
* `gulp clean` Deletes the distribution directory
* `gulp watch` Starts watching the asset files
* `gulp uncss` Reads a `sitemap.json` file and removes unused selectors

#### Out of the box resource tasks

* `gulp scripts` Build everything on the scripts directory
* `gulp styles` Build everything on the styles directory
* `gulp fonts` Build everything on the fonts directory
* `gulp images` Build everything on the images directory

#### Creating new tasks

To create new generic gulp tasks, just create a file inside `.crius/tasks`, import `gulp` and create a task as if it was inside the gulpfile itself.

All tasks defined on the mentioned directory are imported BEFORE the resource tasks. If it's needed to load them AFTER the resource tasks, you can define a 'later-loading' queue at the beginning of the `gulpfile.js`. For an example, check the `loadLater` constant which already delays the loading of `default.js`.

### Gulp Parameters

You can also pass the following parameters to gulp:

* `--sync` Starts browserSync. Use only with `gulp watch`
* `-d` Asset debug mode. It won't minify the files
* `-p` Production mode. File names will be appended with a hash of its content for cache-busting

The available parameters can be extended at `.crius/params.js`.

## Observations

* The included script task does not use `.babelrc`. If you want to change any babel settings, please refer to `./crius/resource-modules/scripts.js`.

## External documentation
* [Asset Orchestrator documentation](https://github.com/kaisermann/asset-orchestrator/blob/master/manifest.md)
* [RolleiFLEX grid documentation](http://kaisermann.github.io/rolleiflex/)
* [Ruputure: Media Queries with Stylus documentation](http://jescalan.github.io/rupture/)
* [Sage documentation](https://github.com/roots/sage/) (Sage 9 uses webpack, please refer to the **8.\*.*** documentation.)

## Credits and Inspirations

* [Asset builder](https://github.com/austinpray/asset-builder)
* [Sage Starter Theme](https://github.com/roots/sage/)
