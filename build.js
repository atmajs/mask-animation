/**
 *	IncludeJSBuild
 *
 *	``` $ includejs build.js ```
 **/


global.config = {
	'settings': {
		io: {
			extensions: {
				js: ['condcomments:read', 'importer:read']
			}
		}
	},
	'import': {
		files: 'builds/**',
		output: 'lib/'
	},
	'jshint': {
		files: ['lib/mask.animation.js'],
		jshint: JSHint()
	},
	'uglify': {
		files: 'lib/mask.animation.js'
	},

	'import.mask': {
		action: 'copy',
		files: {
			'../mask/lib/mask.js': '.import/mask.js'
		}
	},

	'watch': {
		files: 'src/**',
		config: '#[import]'
	},

	'defaults': ['import', 'jshint', 'uglify']
};




function JSHint() {

	return {
		options: {
			expr: true,
			curly: true,
			eqeqeq: true,
			forin: false,
			immed: true,
			latedef: true,
			newcap: true,
			noarg: true,
			noempty: true,
			nonew: true,
			regexp: true,
			undef: true,
			unused: true,
			strict: true,
			trailing: true,

			boss: true,
			eqnull: true,
			es5: true,
			lastsemic: true,
			browser: true,
			node: true,
			onevar: false,
			evil: true,
			sub: true,
			debug: true
		},
		globals: {
			define: true,
			require: true,
			Compo: true,
			mask: true
		}
	};
}
