module.exports = {
	'postcss-advanced-variables': {
		'basic': {
			message: 'supports basic usage'
		},
		'basic:var': {
			message: 'supports { variables } usage',
			options: {
				variables: {
					pass: 'blue',
					boolean: false
				}
			}
		},
		'basic:var-func': {
			message: 'supports { variables() } usage',
			options: {
				variables: (name, node) => 'pass' === name ? 'blue' : 5
			}
		},
		'mixed': {
			message: 'supports mixed usage'
		},
		'scss': {
			message: 'supports scss interpolation',
			source: 'scss.scss',
			expect: 'scss.expect.scss',
			result: 'scss.result.scss',
			processOptions: {
				syntax: require('postcss-scss')
			}
		},
		'unresolved:ignore': {
			message: 'supports { unresolved: "ignore" } option',
			expect: 'unresolved.expect.css',
			options: {
				unresolved: 'ignore'
			}
		},
		'unresolved:throw': {
			message: 'supports { unresolved: "throw" } option',
			expect: 'unresolved.expect.css',
			options: {
				unresolved: 'throw'
			},
			error: {
				reason: /^Could not resolve the variable/
			}
		},
		'unresolved:warn': {
			message: 'supports { unresolved: "warn" } option',
			expect: 'unresolved.expect.css',
			options: {
				unresolved: 'warn'
			},
			warning: 1
		}
	}
};
