'use strict';

module.exports = function( grunt ) {

	function merge_options(obj1, obj2) {
		var obj3 = {};
		for (var obj1Attrname in obj1) { obj3[obj1Attrname] = obj1[obj1Attrname]; }
		for (var obj2Attrname in obj2) { obj3[obj2Attrname] = obj2[obj2Attrname]; }
		return obj3;
	}

	// should be at 100, will need to ratchet down:
	var appJsMaxLineWidth = 145;
	var specJsMaxLineWidth = 180;
	var commonJshintOptions = {
		maxlen: appJsMaxLineWidth,
		curly: true,
		eqeqeq: true,
		expr: true,
		immed: true,
		latedef: true,
		newcap: true,
		noarg: true,
		sub: true,
		undef: true,
		boss: true,
		eqnull: true,
		es3: true
	};

	var appJshintGlobals = {
		angular: true,
		$: true,
		Base64Binary: true,
		jQuery: true,
		LocalFileSystem: true,
		cordova: true,
		console: true
	};

	grunt.initConfig({

		csslint: {
			options: {
				'adjoining-classes': false,
				'compatible-vendor-prefixes': false,
				'universal-selector': false,
				'gradients': false,
				'known-properties': false,
				'zero-units': false,
				'vendor-prefix': false,
				'fallback-colors': false,
				'overqualified-elements': false,
				'qualified-headings': false,
				'box-model': false,
				'duplicate-properties': false,
				'box-sizing': false,
				'display-property-grouping': false,
				'ids': false,
				'duplicate-background-images': false,
				'text-indent': false
			},
			src: [
				'www/css/**/*.css'
			]
		},

		jshint: {
			gruntfile: {
				src: [
					'Gruntfile.js'
				],
				options: merge_options(commonJshintOptions, {
					node: true,
					globals: {
						console: true,
						require: true,
						grunt: true
					}
				})
			},
			app: {
				src: [
					'www/**/*.js',
					'!www/vendor/**/*.js'
				],
				options: merge_options(commonJshintOptions, {
					maxlen: null,
					browser: true,
					globals: appJshintGlobals
				})
			},
			app_restricted_line_length: {
				src: [
					'<%= jshint.app.src %>'
					// these files should have their line length reduced
					// and removed from this exclude:
				],
				options: merge_options(commonJshintOptions, {
					browser: true,
					globals: appJshintGlobals
				})
			},
			test: {
				src: [
					'test/unit/lib/testHelper.js',
					'test/unit/src/www/**/*.js'
				],
				options: merge_options(commonJshintOptions, {
					maxlen: specJsMaxLineWidth,
					browser: true,
					globals: merge_options(appJshintGlobals, {
						Timecop: true,
						mostRecentAjaxRequest: true,
						MockAjax: true,
						whenRequest: true,
						allOf: true,
						assertThat: true,
						canTransitionTo: true,
						is: true,
						isIn: true,
						not: true,
						spy: true,
						verify: true,
						fail: true,
						zeroInteractions: true,
						verifyZeroInteractions: true,
						verifyNoMoreInteractions: true,
						anything: true,
						mock: true,
						mockFunction: true,
						times: true,
						never: true,
						once: true,
						hasFunction: true,
						oneOf: true,
						hasItem: true,
						hasItems: true,
						hasMember: true,
						hasCssClass: true,
						hasNoCssClass: true,
						hasAttr: true,
						sameAs: true,
						matches: true,
						empty: true,
						nil: true,
						number: true,
						containsString: true,
						startsWith: true,
						greaterThan: true,
						greaterThanOrEqualTo: true,
						lessThan: true,
						lessThanOrEqualTo: true,

						test: true,
						module: true,
						inject: true,
						jasmine: true,
						describe: true,
						ddescribe: true,
						xdescribe: true,
						it: true,
						iit: true,
						xit: true,
						expect: true,
						beforeEach: true,
						afterEach: true,
						spyOn: true,
						runs: true,
						waits: true,
						waitsFor: true
					})
				})
			}
		},


		lintspaces: {
			gruntfile: {
				src: '<%= jshint.gruntfile.src %>',
				options: {
					trailingspaces: true,
					indentation: 'tabs',
					ignores: ['js-comments']
				}
			},
			app: {
				src: [
					'<%= jshint.app.src %>',
					'!www/vendor/**/*.js'
				],
				options: {
					trailingspaces: true,
					indentation: 'tabs',
					ignores: ['js-comments']
				}
			},
			test: {
				src: 'test/unit/src/www/**/*.js',
				options: {
					trailingspaces: true,
					indentation: 'tabs',
					ignores: ['js-comments']
				}
			},
			css: {
				src: '<%= csslint.src %>',
				options: {
					trailingspaces: true,
					indentation: 'tabs'
				}
			}
		},

		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile', 'lintspaces:gruntfile'],
				options: {
					interrupt: true
				}
			},
			app: {
				files: ['www/**/*.js', 'www/**/**.html'],
				tasks: ['jshint:app', 'clean:coverage', 'karma:continuous', 'coverage', 'jshint:app_restricted_line_length', 'lintspaces:app'],
				options: {
					interrupt: true
				}
			},
			css: {
				files: '<%= csslint.src %>',
				tasks: ['csslint', 'lintspaces:css'],
				options: {
					interrupt: true
				}
			},
			test: {
				files: 'test/unit/**/*.js',
				tasks: ['jshint:test', 'clean:coverage', 'karma:continuous', 'coverage', 'lintspaces:test'],
				options: {
					interrupt: true
				}
			}
		},

		karma: {
			options: {
				configFile: 'test/unit/karma-unit.conf.js'
			},
			continuous: {
				browsers: ['PhantomJS']
			},
			debug: {
				singleRun: false,
				browsers: ['Chrome']
			}
		},

		clean: {
			coverage: {
				src: [
					'target', 'test/coverage'
				]
			}
		},

		coverage: {
			options: {
				thresholds: {
					// these should go up over time, definitely not down:
					'statements': 99,
					'branches': 84,
					'lines': 99,
					'functions': 99
				},
				dir: 'coverage',
				root: 'test'
			}
		},

		availabletasks: {
				tasks: {}
		},

		bower: {
			install: {
				options: {
					copy: true
				}
			}
		},

		copy: {
			main: {
				files: [
					{
						expand: true,
						src: [
							'bower_components/angular/angular.js',
							'bower_components/angular-route/angular-route.js',
							'bower_components/jquery/dist/jquery.js'
						],
						dest: 'www/vendor/',
						flatten: true
					},
					{
						expand: true,
						src: [
							'bower_components/bootstrap/dist/js/bootstrap.js',
							'bower_components/bootstrap/dist/css/bootstrap.css'
						],
						dest: 'www/vendor/bootstrap/',
						flatten: true
					},
					{
						expand: true,
						src: [
							'bower_components/bootstrap/dist/fonts/*'
						],
						dest: 'www/vendor/fonts/',
						flatten: true
					},
					{
						expand: true,
						src: [
							'bower_components/angular-mocks/angular-mocks.js',
							'bower_components/jasmine/lib/jasmine-core/jasmine.js'
						],
						dest: 'test/unit/vendor',
						flatten: true
					}
				]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-lintspaces');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-available-tasks');
	grunt.loadNpmTasks('grunt-istanbul-coverage');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('tasks', ['availabletasks']);
	grunt.registerTask('debug', ['karma:debug']);
	grunt.registerTask('jscoverage', ['clean:coverage', 'karma:continuous', 'coverage']);
	grunt.registerTask('test', ['jshint', 'jscoverage']);
	grunt.registerTask('dev', ['watch']);
	grunt.registerTask('quality', ['csslint', 'test', 'lintspaces']);
	grunt.registerTask('bc', ['bower', 'copy', 'clean:coverage', 'quality']);
	grunt.registerTask('default', ['bc']);

};
