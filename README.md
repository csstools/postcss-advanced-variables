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

@for $count from 1 to 5 by 2 {
  @if $count > 2 {
    .col-$count {
      width: #{$count}0%;
    }
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

---

## Features

### $variables

Variables let you store information to be reused anywhere in a stylesheet.

Variables are set just like CSS properties, placing a `$` symbol before the
name of the variable (`$var-name`). They may also be set placing a `$` symbol
before two parentheses wrapping the name of the variable (`$(var-name)`), or by
wrapping the `$` symbol and variable name in curly braces preceeded by a hash
(`#{$var-name}`).

```scss
$font-size:     1.25em;
$font-stack:    "Helvetica Neue", sans-serif;
$primary-color: #333;

body {
  font: $font-size $(font-stack);
  color: #{$primary-color};
}
```

*Note: To use `#{$var-name}` without issues, you will need to include the
[PostCSS SCSS Syntax].

In that example, `$font-size`, `$font-stack`, and `$primary-color` are replaced
with their values.

```css
body {
  font: 1.25em "Helvetica Neue", sans-serif;
  color: #333;
}
```

### @if and @else Rules

Conditionals like `@if` and `@else` let you use rules in a stylesheet if they
evaluate true or false.

Conditionals are set by writing `@if` before the expression you want to
evaluate. If the expression is true, then its contents are included in the
stylesheet. If the expression is false, then its contents are not included, but
the contents of an `@else` that follows it are included.

```scss
$type: monster;

p {
  @if $type == ocean {
    color: blue;
  } @else {
    color: black;
  }
}
```

In that example, `$type === ocean` is false, so the `@if` contents are ignored
and the `@else` contents are used.

```css
p {
  color: black;
}
```

### @for and @each Rules

Iterators like `@for` and `@each` let you repeat content in a stylesheet.

A `@for` statement repeats by a numerical counter defined as a variable.

It can be written as `@for $counter from <start> through <end>` where
`$counter` is the name of the iterating variable, `<start>` is the number to
start with, and `<end>` is the number to finish with.

It can also be written as `@for $counter from <start> to <end>` where
`$counter` is still the name of the counter variable, `<start>` is still the
number to start with, but `<end>` is now the number to finish
*before, but not include*.

When `<start>` is greater than `<end>`, the counter will decrement instead of
increment.

Either form of `@for` can be written as
`@for $var from <start> to <end> by <increment>` or
`@for $var from <start> through <end> by <increment>`
where `<incremement>` is the amount the counter variable will advance.

```scss
@for $i from 1 through 5 by 2 {
  .width-#{$i} {
    width: #{$i}0em;
  }
}

@for $j from 1 to 5 by 2 {
  .height-#{$j} {
    height: #{$j}0em;
  }
}
```

In that example, `$i` is repeated from 1 through 5 by 2, which means it is
repeated 3 times (1, 3, and 5). Meanwhile, `$j` is repeated from 1 to 5 by 2,
which means it is repeated 2 times (1 and 3).

```css
.width-1 {
  width: 10em;
}

.width-3 {
  width: 30em;
}

.width-5 {
  width: 50em;
}

.height-1 {
  height: 10em;
}

.height-3 {
  height: 30em;
}
```

An `@each` statement statement repeats through a list of values.

It can be written as `@each $item in $list` where `$item` is the
name of the iterating variable and `$list` is the list of values being looped
over.

```scss
@each $animal in (puma, sea-slug, egret, salamander) {
  .#{$animal}-icon {
    background-image: url("images/icon-#{$animal}.svg");
  }
}
```

In that example, a list of 4 animals is looped over to create 4 unique
classnames.

```css
.puma-icon {
  background-image: url("images/icon-puma.svg");
}

.sea-slug-icon {
  background-image: url("images/icon-sea-slug.svg");
}

.egret-icon {
  background-image: url("images/icon-egret.svg");
}

.salamander-icon {
  background-image: url("images/icon-salamander.svg");
}
```

It can also be written as `@each $item $counter in $list` where `$item` is
still the name of the iterating variable and `$list` is still the list of values
being looped over, but now `$counter` is the numerical counter.

```scss
@each $animal $i in (puma, sea-slug, egret, salamander) {
  .#{$animal}-icon {
    background-image: url("images/icon-#{$i}.svg");
  }
}
```

```css
.puma-icon {
  background-image: url("images/icon-1.svg");
}

.sea-slug-icon {
  background-image: url("images/icon-2.svg");
}

.egret-icon {
  background-image: url("images/icon-3.svg");
}

.salamander-icon {
  background-image: url("images/icon-4.svg");
}
```

In that example, a list of 4 animals is looped over to create 4 unique
classnames.

### @mixin, @include, and @content rules

Mixins let you reuse rule in a stylesheet. A `@mixin` defines the content you
want to reuse, while an `@include` rule includes it anywhere in your stylesheet.

Mixins are set by writing `@mixin` before the name of the mixin you define.
This can be (optionally) followed by comma-separated variables you
want to use inside of it. Mixins are then used anywhere by writing `@include`
before the name of the mixin you are using. This is (again, optionally)
followed by some comma-separated arguments you want to pass into the mixin as
the (aforementioned) variables.

```scss
@mixin heading-text {
  color: #242424;
  font-size: 4em;
}

h1, h2, h3 {
  @include heading-text;
}

.some-heading-component > :first-child {
  @include heading-text;
}
```

In that example, `@include heading-text` is replaced with its contents.

```css
h1, h2, h3 {
  color: #242424;
  font-size: 4em;
}

.some-heading-component > :first-child {
  color: #242424;
  font-size: 4em;
}
```

Remember, mixins can be followed by comma-separated variables you
want to pass into the mixin as variables.

```scss
@mixin heading-text($color: #242424, $font-size: 4em) {
  color: $color;
  font-size: $font-size;
}

h1, h2, h3 {
  @include heading-text;
}

.some-heading-component > :first-child {
  @include heading-text(#111111, 6em);
}
```

In that example, `@include heading-text` is replaced with its contents, but
this time some of their contents are customized with variables.

```css
h1, h2, h3 {
  color: #242424;
  font-size: 4em;
}

.some-heading-component > :first-child {
  color: #111111;
  font-size: 6em;
}
```

---

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

These options only apply to the `@import` at-rule.

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

#### importFilter

The `importFilter` option determines whether an import will be inlined.

The `importFilter` option can be a function or an regular expression.

By default, imports are ignored if they begin with a protocol or
protocol-relative slashes (`//`).

```js
require('postcss-advanced-variables')({
  importPaths: ['path/to/files', 'another/path/to/files']
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
[PostCSS SCSS Syntax]: https://github.com/postcss/postcss-scss
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[Sass Import Resolve Specification]: https://jonathantneal.github.io/sass-import-resolve/
