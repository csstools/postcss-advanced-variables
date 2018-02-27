# Changes to PostCSS Advanced Variables

### 2.3.3 (February 10, 2018)

- Fixed: asynchronous transforms to allow for imported mixins and variables

### 2.3.2 (February 10, 2018)

- Fixed: imports failing when `from` is missing

### 2.3.1 (February 10, 2018)

- Added: `babel-plugin-array-includes` instead of `babel-polyfill` for publish
- Fixed: `@mixin` rules to support being declared with empty parens
- Noted: Recommend `postcss-scss-syntax` to best support variable interpolation

### 2.3.0 (January 6, 2018)

- Added: `importFilter` option to accept or ignore imports by function or regex
- Added: Support for media parameters after `@import` rules
- Added: Support for case-insensitive at-rules
- Fixed: Protocol and protocol-less imports are ignored

### 2.2.0 (January 2, 2018)

- Added: Support for `@import`
- Added: `disable` option to conditionally disable any feature(s)
- Fixed: How iterator arrays and objects are treated

### 2.1.0 (January 1, 2018)

- Added: Support for `@mixin`, `@include`, and `@content`

### 2.0.0 (December 31, 2017)

- Completely rewritten
- Added: `unresolved` option to throw errors or warnings on unresolved variables
- Added: Support for the `#{$var}` syntax
- Added: Support for iterators in `@each` at-rules
- Added: Support for boolean `@if` at-rules
  (`@each $item $index in $array`)
- Added: Support for variable replacement in all at-rules
- Added: Support for neighboring variables `$a$b`
- Fixed: Number comparison in `@if` at-rules

## 1.2.2 (October 21, 2015)

- Removed: Old gulp file

## 1.2.1 (October 21, 2015)

- Updated: PostCSS 5.0.10
- Updated: Tests

## 1.2.0 (October 21, 2015)

- Added: Global variables set in options

## 1.1.0 (September 8, 2015)

- Added: Support for `!default`

## 1.0.0 (September 7, 2015)

- Updated: PostCSS 5.0.4
- Updated: Chai 3.2.0
- Updated: ESLint 1.0
- Updated: Mocha 2.1.3  

## 0.0.4 (July 22, 2015)

- Added: Support for vars in @media

## 0.0.3 (July 8, 2015)

- Added: Support for @else statements

## 0.0.2 (July 7, 2015)

- Fixed: Some variable evaluations
- Added: Support for deep arrays

## 0.0.1 (July 7, 2015)

- Pre-release
