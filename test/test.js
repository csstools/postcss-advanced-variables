var postcss = require('postcss');
var expect  = require('chai').expect;
var plugin  = require('../');

var test = function (input, output, opts, options, done) {
	postcss([ plugin(opts) ])
		.process(input, options)
		.then(function (result) {
			expect(result.css).to.eql(output);
			expect(result.warnings()).to.be.empty;
			done();
		}).catch(function (error) {
			done(error);
		});
};

describe('basic usage', function () {
	it('variables', function (done) {
		test(
			'$red: #f00; .x { color: $red } $blue: #00f; .y { color: $blue } .z {}',
			'.x { color: #f00 } .y { color: #00f } .z {}',
			{},
			{},
			done
		);
	});

	it('variables with !default', function (done) {
		test(
			'$red: #f00; $red: #00f !default; .x { color: $red } $blue: #00f; .y { color: $blue } .z {}',
			'.x { color: #f00 } .y { color: #00f } .z {}',
			{},
			{},
			done
		);
	});

	it('variables in selector without interpolation', function(done) {
		test(
			'$x: red; .some-$x { color: green; }',
			'.some-red { color: green; }',
			{},
			{},
			done
		);
	});

	it('variables in selector with () interpolation', function(done) {
		test(
			'$x: red; .some-$(x) { color: green; }',
			'.some-red { color: green; }',
			{},
			{},
			done
		);
	});

	it('variables in selector with #{} interpolation (postcss-scss)', function(done) {
		test(
			'$x: red; .some-#{$x} { color: green; }',
			'.some-red { color: green; }',
			{},
			{syntax: require('postcss-scss')},
			done
		);
	});

	it('variables in simple media', function (done) {
		test(
			'$x: 600px; @media (min-width: $x) {}',
			'@media (min-width: 600px) {}',
			{},
			{},
			done
		);
	});

	it('variables in options', function (done) {
		test(
			'body { background-color: $backgroundColor; }',
			'body { background-color: red; }',
			{
				variables: {
					backgroundColor: 'red'
				}
			},
			{},
			done
		);
	});

	it('variables in complex media', function (done) {
		test(
			'$x: 600px; $orientation: landscape; @media not (min-width: $x), handheld and (orientation: $orientation) {}',
			'@media not (min-width: 600px), handheld and (orientation: landscape) {}',
			{},
			{},
			done
		);
	});

	it('fors', function (done) {
		test(
			'@for $i from 1 to 5 by 2 { .x-$i {} } @for $i from 5 to 1 by 2 { .y-$i {} } .z {}',
			'.x-1 {} .x-3 {} .x-5 {} .y-5 {} .y-3 {} .y-1 {} .z {}',
			{},
			{},
			done
		);
	});

	it('ifs (==)', function (done) {
		test(
			'@if 1 == 1 { .x {} } @if 1 == 2 { .y {} } .z {}',
			'.x {} .z {}',
			{},
			{},
			done
		);
	});

	it('ifs (!=)', function (done) {
		test(
			'@if 1 != 1 { .x {} } @if 1 != 2 { .y {} } .z {}',
			'.y {} .z {}',
			{},
			{},
			done
		);
	});

	it('ifs (<)', function (done) {
		test(
			'@if 1 < 2 { .x {} } @if 1 < 1 { .y {} } .z {}',
			'.x {} .z {}',
			{},
			{},
			done
		);
	});

	it('ifs (>)', function (done) {
		test(
			'@if 1 > 1 { .x {} } @if 1 > 0 { .y {} } .z {}',
			'.y {} .z {}',
			{},
			{},
			done
		);
	});

	it('ifs (<=)', function (done) {
		test(
			'@if 1 <= 1 { .x {} } @if 1 <= 0 { .y {} } .z {}',
			'.x {} .z {}',
			{},
			{},
			done
		);
	});

	it('ifs (>=)', function (done) {
		test(
			'@if 1 >= 2 { .x {} } @if 1 >= 1 { .y {} } .z {}',
			'.y {} .z {}',
			{},
			{},
			done
		);
	});

	it('elses', function (done) {
		test(
			'@if 1 == 1 { .x-1 {} } @else { .x-2 {} } @if 1 == 2 { .y-1 {} } @else { .y-2 {} } .z {}',
			'.x-1 {} .y-2 {} .z {}',
			{},
			{},
			done
		);
	});

	it('eaches', function (done) {
		test(
			'@each $i in (foo, bar) { .$i {} } @each $i in (foo, bar, baz) { .x-$i {} } .y {}',
			'.foo {} .bar {} .x-foo {} .x-bar {} .x-baz {} .y {}',
			{},
			{},
			done
		);
	});
});

describe('nested usage', function () {
	it('variable as variable', function (done) {
		test(
			'$red: #f00; $color: $red; .x { color: $color } .y {}',
			'.x { color: #f00 } .y {}',
			{},
			{},
			done
		);
	});

	it('for in for', function (done) {
		test(
			'@for $i from 1 to 5 by 2 { @for $j from 3 to 1 { .x-$(i)-$(j) {} } } .y {}',
			'.x-1-3 {} .x-1-2 {} .x-1-1 {} .x-3-3 {} .x-3-2 {} .x-3-1 {} .x-5-3 {} .x-5-2 {} .x-5-1 {} .y {}',
			{},
			{},
			done
		);
	});

	it('each in each', function (done) {
		test(
			'@each $i in ((foo, bar), (baz, qux)) { @each $j in $i { .x-$j {} } } .y {}',
			'.x-foo {} .x-bar {} .x-baz {} .x-qux {} .y {}',
			{},
			{},
			done
		);
	});
});

describe('mixed nested usage', function () {
	it('variable + for', function (done) {
		test(
			'$red: #f00; @for $i from 1 to 5 by 2 { .x-$i { color: $red; } } .y {}',
			'.x-1 { color: #f00\n} .x-3 { color: #f00\n} .x-5 { color: #f00\n} .y {}',
			{},
			{},
			done
		);
	});

	it('if + variable', function (done) {
		test(
			'$red: #f00; $i: 5; @if $i >= 3 { .x-$i { color: $red; } } .y {}',
			'.x-5 { color: #f00\n} .y {}',
			{},
			{},
			done
		);
	});

	it('if + fors', function (done) {
		test(
			'@for $i from 1 to 5 by 2 { @if $i >= 3 { .x-$i {} } } .y {}',
			'.x-3 {} .x-5 {} .y {}',
			{},
			{},
			done
		);
	});

	it('if + variable + for', function (done) {
		test(
			'$red: #f00; @for $i from 1 to 5 by 2 { @if $i >= 3 { .x-$i { color: $red; } } } .y {}',
			'.x-3 { color: #f00\n} .x-5 { color: #f00\n} .y {}',
			{},
			{},
			done
		);
	});

	it('each + if', function (done) {
		test(
			'@each $i in (foo, bar, baz) { @if $i == foo { .x-$i { background: url($i.png); } } } .y {}',
			'.x-foo { background: url(foo.png)\n} .y {}',
			{},
			{},
			done
		);
	});

	it('each + for', function (done) {
		test(
			'@each $i in (1, 2, 3) { @for $j from $i to 3 { .x-$i { background: url($j.png); } } } .y {}',
			'.x-1 { background: url(1.png)\n} .x-1 { background: url(2.png)\n} .x-1 { background: url(3.png)\n} .x-2 { background: url(2.png)\n} .x-2 { background: url(3.png)\n} .x-3 { background: url(3.png)\n} .y {}',
			{},
			{},
			done
		);
	});

	it('each + for + if', function (done) {
		test(
			'@each $i in (1, 2, 3) { @for $j from $i to 3 { @if $i >= 3 { .x-$i { background: url($j.png); } } } } .y {}',
			'.x-3 { background: url(3.png)\n} .y {}',
			{},
			{},
			done
		);
	});

	it('each + variable + for + if', function (done) {
		test(
			'$dir: assets/images; @each $i in (1, 2, 3) { @for $j from $i to 3 { @if $i >= 3 { .x-$i { background: url($dir/$j.png); } } } } .y {}',
			'.x-3 { background: url(assets/images/3.png)\n} .y {}',
			{},
			{},
			done
		);
	});
});
