# PostCSS Advanced Variables [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![Linux Build Status][cli-img]][cli-url]
[![Windows Build Status][win-img]][win-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Advanced Variables] lets you use Sass-like variables, conditionals,
and iterators in CSS.

```scss
$dir: assets/icons;

@each $icon in (foo, bar, baz) {
  .icon-$icon {
    background: url('$dir/$icon.png');
  }
}

@for $index from 1 to 5 by 2 {
  .col-$index {
    width: $(index)0%;
  }
}

@import "path/to/some-file";

/* after */

.icon-foo {
  background: url('assets/icons/foo.png');
}

.icon-bar {
  background: url('assets/icons/bar.png');
}

.icon-baz {
  background: url('assets/icons/baz.png');
}

.col-1 {
  width: 10%;
}

.col-3 {
  width: 30%;
}

.col-5 {
  width: 50%;
}

// the contents of "path/to/_some-file.scss"
```

## Usage

Add [PostCSS Advanced Variables] to your build tool:

```bash
npm install postcss-advanced-variables --save-dev
```

#### Node

Use [PostCSS Advanced Variables] to process your CSS:

```js
require('postcss-advanced-variables').process(YOUR_CSS);
```

#### PostCSS

Add [PostCSS] to your build tool:

```bash
npm install postcss --save-dev
```

Use [PostCSS Advanced Variables] as a plugin:

```js
postcss([
  require('postcss-advanced-variables')(/* options */)
]).process(YOUR_CSS);
```

#### Gulp

Add [Gulp PostCSS] to your build tool:

```bash
npm install gulp-postcss --save-dev
```

Use [PostCSS Advanced Variables] in your Gulpfile:

```js
var postcss = require('gulp-postcss');

gulp.task('css', function () {
  return gulp.src('./src/*.css').pipe(
    postcss([
      require('postcss-advanced-variables')(/* options */)
    ])
  ).pipe(
    gulp.dest('.')
  );
});
```

#### Grunt

Add [Grunt PostCSS] to your build tool:

```bash
npm install grunt-postcss --save-dev
```

Use [PostCSS Advanced Variables] in your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
  postcss: {
    options: {
      use: [
        require('postcss-advanced-variables')(/* options */)
      ]
    },
    dist: {
      src: '*.css'
    }
  }
});
```

## Options

### variables

The `variables` option defines global variables used when they cannot be
resolved automatically.

```js
require('postcss-advanced-variables')({
  variables: {
    'site-width': '960px'
  }
});
```

The `variables` option also accepts a function, which is given 2 arguments; the
name of the unresolved variable, and the PostCSS node that used it.

```js
require('postcss-advanced-variables')({
  variables(name, node) {
    if (name === 'site-width') {
      return '960px';
    }

    return undefined;
  }
});
```

```scss
.hero {
  max-width: $site-width;
}

/* after */

.hero {
  max-width: 960px;
}
```

### unresolved

The `unresolved` option defines how unresolved variables, mixins, and imports
should be handled. The available options are `throw`, `warn`, and `ignore`. The
default option is to `throw`.

```js
require('postcss-advanced-variables')({
  unresolved: 'ignore' // ignore unresolved variables
});
```

### disable

The `disable` option defines which features should be disabled in
[PostCSS Advanced Variables].

The `disable` option can be a string or an array, and the features that can be
disabled are `@content`, `@each`, `@else`, `@if`, `@include`, `@import`, `@for`,
and `@mixin`.

```js
require('postcss-advanced-variables')({
  disable: '@mixin, @include, @content' // ignore @mixin, @include, and @content at-rules
});
```

### Import Options

#### importPaths

The `importPaths` option defines a path or multiple paths used to lookup
files when they cannot be found automatically.

The `importPaths` option can be a string or an array.

By default, imports are resolved using the [Sass Import Resolve Specification].

```js
require('postcss-advanced-variables')({
  importPaths: ['path/to/files', 'another/path/to/files']
});
```

#### importResolve

The `importResolve` option defines the file resolver used by imports. It is a
function given 3 arguments; the url id, the current working directory, and the
options processed by [PostCSS Advanced Variables].

The `importResolve` function should return a Promise with an object containing
the full path (`file`) and the contents of the file (`contents`).

```js
const resolve = require('custom-resolver');

require('postcss-advanced-variables')({
  // a resolver may work many ways, and this is just an example
  importResolve: (id, cwd, opts) => resolve({ id, cwd });
});
```

#### importRoot

The `importRoot` option defines the root directory used by imports when the
current directory cannot be detected. Its default value is `process.cwd()`.

```js
require('postcss-advanced-variables')({
  importRoot: 'path/to/root'
});
```

#### importCache

The `importCache` option defines a cache made available to the options object
that may be used by the [file resolver](#importResolve).

```js
const sharedCache = {};

require('postcss-advanced-variables')({
  importCache: sharedCache
});
```

[npm-url]: https://www.npmjs.com/package/postcss-advanced-variables
[npm-img]: https://img.shields.io/npm/v/postcss-advanced-variables.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-advanced-variables
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-advanced-variables.svg
[win-url]: https://ci.appveyor.com/project/jonathantneal/postcss-advanced-variables
[win-img]: https://img.shields.io/appveyor/ci/jonathantneal/postcss-advanced-variables.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[PostCSS Advanced Variables]: https://github.com/jonathantneal/postcss-advanced-variables
[PostCSS]: https://github.com/postcss/postcss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[Sass Import Resolve Specification]: https://jonathantneal.github.io/sass-import-resolve/
