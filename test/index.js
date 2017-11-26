var tests = {
	'postcss-advanced-variables': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:var': {
			message: 'supports basic usage with variables',
			options: {
				variables: {
					pass: 'blue'
				}
			}
		},
		'mixed': {
			message: 'supports mixed usage'
		},
		'scss': {
			message: 'supports scss interpolation',
			syntax: require('postcss-scss')
		}
	}
};

var debug = true;
var dir   = './test/fixtures/';

var fs      = require('fs');
var path    = require('path');
var postcss = require('postcss');
var advancedVarsPlugin  = require('../');
var test    = require('tape');
var reporter    = require('postcss-reporter');

Object.keys(tests).forEach(function (name) {
	var parts = tests[name];

	test(name, function (t) {
		var fixtures = Object.keys(parts);

		t.plan(fixtures.length * 2);

		fixtures.forEach(function (fixture) {
			var message    = parts[fixture].message;
			var options    = parts[fixture].options;
			var syntax    = parts[fixture].syntax;
			var warning    = parts[fixture].warning || 0;
			var warningMsg = message + ' (# of warnings)';

			var baseName   = fixture.split(':')[0];
			var testName   = fixture.split(':').join('.');

			var inputPath  = path.resolve(dir + baseName + '.css');
			var expectPath = path.resolve(dir + testName + '.expect.css');
			var actualPath = path.resolve(dir + testName + '.actual.css');

			var inputCSS = '';
			var expectCSS = '';

			try {
				inputCSS = fs.readFileSync(inputPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(inputPath, inputCSS);
			}

			try {
				expectCSS = fs.readFileSync(expectPath,  'utf8');
			} catch (error) {
				fs.writeFileSync(expectPath, expectCSS);
			}

			var plugins = [
				advancedVarsPlugin(options),
				reporter({ clearReportedMessages : false })
			];

			var processOptions = { from : inputPath };
			if (syntax !== undefined) {
				processOptions.syntax = syntax;
			}

			postcss(plugins).process(inputCSS, processOptions).then(function (result) {
				var actualCSS = result.css;

				if (debug) fs.writeFileSync(actualPath, actualCSS);

				// Ignore differences between start of line indentions and empty lines (postcss v6 is outputting slightly different)
				actualCSS = actualCSS.replace(/^[\s\n]+/gm, '');
				expectCSS = expectCSS.replace(/^[\s\n]+/gm, '');

				t.equal(actualCSS, expectCSS, message);

				var resultWarnings = result.warnings();
				t.equal(resultWarnings.length, warning, warningMsg);
			}).catch(function (error) {
				console.log('Promise Rejected', error);
			});

		});
	});
});
