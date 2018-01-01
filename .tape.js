module.exports = {
	'postcss-advanced-variables': {
		'default': {
			message: 'supports !default usage'
		},
		'default:var': {
			message: 'supports !default { variables } usage',
			options: {
				variables: {
					default: 'custom-value'
				}
			}
		},
		'default:var-func': {
			message: 'supports !default { variables() } usage',
			options: {
				variables: (name, node) => 'custom-fn-value'
			}
		},
		'if-else': {
			message: 'supports @if/@else usage'
		},
		'for-each': {
			message: 'supports @for/@each usage'
		},
		'atrules': {
			message: 'supports generic at-rules usage'
		},
		'mixins': {
			message: 'supports mixins usage'
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
		'unresolved-include:ignore': {
			message: 'supports { unresolved: "ignore" } option with mixins',
			expect: 'unresolved-include.expect.css',
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
		'unresolved-include:throw': {
			message: 'supports { unresolved: "throw" } option with mixins',
			expect: 'unresolved-include.expect.css',
			options: {
				unresolved: 'throw'
			},
			error: {
				reason: /^Could not resolve the mixin/
			}
		},
		'unresolved:warn': {
			message: 'supports { unresolved: "warn" } option',
			expect: 'unresolved.expect.css',
			options: {
				unresolved: 'warn'
			},
			warning: 1
		},
		'unresolved-include:warn': {
			message: 'supports { unresolved: "warn" } option with mixins',
			expect: 'unresolved-include.expect.css',
			options: {
				unresolved: 'warn'
			},
			warning: 1
		}
	}
};
