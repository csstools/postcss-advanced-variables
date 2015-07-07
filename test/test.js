var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
	postcss([ plugin(opts) ]).process(input).then(function (result) {
		expect(result.css).to.eql(output);

		expect(result.warnings()).to.be.empty;

		done();
	}).catch(function (error) {
		done(error);
	});
};

describe('postcss-advanced-variables', function () {
	it('replaced variables', function (done) {
		test('$blue: #00F; $red: #F00; a { background-color: $red; color: $(blue) }', 'a { background-color: #F00; color: #00F }', { }, done);
	});

	it('handles variables and for loops', function (done) {
		test('$red: #F00; @for $i from 1 to 5 by 2 { .foo-$i { color: $red; width: 1em } } .bar {}', '.foo-1 { color: #F00; width: 1em\n} .foo-3 { color: #F00; width: 1em\n} .foo-5 { color: #F00; width: 1em\n} .bar {}', {}, done);
	});

	it('handles variables and if equals conditions', function (done) {
		test('$index: 5; @if $index == 5 { .foo { content: $index; } } .bar { color: black }', '.foo { content: 5 } .bar { color: black }', {}, done);
	});

	it('handles variables and if equals conditions (not)', function (done) {
		test('$index: 5; @if $index == 3 { .foo { content: $index; } } .bar { color: black }', '.bar { color: black }', {}, done);
	});

	it('handles variables and if greater-than conditions', function (done) {
		test('$index: 5; @if $index > 3 { .foo { content: $index; } } .bar { color: black }', '.foo { content: 5 } .bar { color: black }', {}, done);
	});

	it('handles variables and if greater-than conditions (not)', function (done) {
		test('$index: 5; @if $index > 5 { .foo { content: $index; } } .bar { color: black }', '.bar { color: black }', {}, done);
	});

	it('handles variables and for loops and if conditions', function (done) {
		test('$red: #F00; @for $i from 1 to 5 by 2 { @if $i >= 3 { .foo-$i { color: $red; width: 1em } } } .bar {}', '.foo-3 { color: #F00; width: 1em\n} .foo-5 { color: #F00; width: 1em\n} .bar {}', {}, done);
	});

	it('handles each loops', function (done) {
		test('@each $text in ("foo", "bar", "baz") { .foo { content: $text } } .bar {}', '.foo { content: "foo"\n} .foo { content: "bar"\n} .foo { content: "baz"\n} .bar {}', {}, done);
	});

	it('handles each loops (the readme example)', function (done) {
		test(
			'$dir: assets/icons; @each $icon in (foo, bar, baz) { .icon-$icon { background: url($dir/$icon.png); } } .bar {}',
			'.icon-foo { background: url(assets/icons/foo.png)\n} .icon-bar { background: url(assets/icons/bar.png)\n} .icon-baz { background: url(assets/icons/baz.png)\n} .bar {}',
			{},
			done
		);
	});

	it('handles for loops (the readme example)', function (done) {
		test(
			'@for $index from 1 to 5 by 2 { .col-$index { width: $(index)0%; } } .bar {}',
			'.col-1 { width: 10%\n} .col-3 { width: 30%\n} .col-5 { width: 50%\n} .bar {}',
			{},
			done
		);
	});

	// // and soon this will work, arrays within arrays
	// it('handles each loops within each loops referencing the iterator', function (done) {
	// 	test('@each $item in (("foo", "bar"), ("baz", "qux")) { @each $text in $item { .foo { content: $text; } } } .bar {}', '', {}, done);
	// });
});
