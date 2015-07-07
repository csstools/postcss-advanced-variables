# PostCSS Advanced Variables [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS Advanced Variables] is a [PostCSS] plugin that converts Sass variables and conditionals into CSS.

```css
/* before */

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
```

## Usage

You just need to follow these two steps to use [PostCSS Advanced Variables]:

1. Add [PostCSS] to your build tool.
2. Add [PostCSS Advanced Variables] as a PostCSS process.

```sh
npm install postcss-advanced-variables --save-dev
```

### Node

```js
postcss([ require('postcss-advanced-variables')({ /* options */ }) ])
```

### Grunt

Add [Grunt PostCSS] to your build tool:

```sh
npm install postcss-advanced-variables --save-dev
```

Enable [PostCSS Advanced Variables] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
				require('postcss-advanced-variables')({ /* options */ })
			]
		},
		dist: {
			src: 'css/*.css'
		}
	}
});
```

[ci]: https://travis-ci.org/jonathantneal/postcss-advanced-variables
[ci-img]: https://travis-ci.org/jonathantneal/postcss-advanced-variables.svg
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Advanced Variables]: https://github.com/jonathantneal/postcss-advanced-variables
