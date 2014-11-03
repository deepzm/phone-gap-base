module.exports = function( config ) {

	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '',

		frameworks: ["jasmine"],

		// list of files / patterns to load in the browser
		files: [
			'../../www/vendor/jquery.js',
			'../../www/vendor/angular.js',
			'../../www/vendor/angular-route.js',
			'../../www/vendor/bootstrap/bootstrap.js',

			'vendor/angular-mocks.js',
			'vendor/jasmine.js',

			'../../www/js/*.js',
			'**/*Spec.js'
		],

		// list of files to exclude
		exclude: [],

		preprocessors: {
			'src/www/**/*.js': ['coverage']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit'
		reporters: ['progress', 'junit', 'coverage'],

		junitReporter: {
		    outputFile : '../target/test_results.xml'
		},

		coverageReporter: {
		    type: 'json',
		    dir:'../coverage'
		},

		plugins: [
			'karma-jasmine',
			'karma-junit-reporter',
			'karma-phantomjs-launcher',
			'karma-chrome-launcher',
			'karma-coverage'
		],

		// web server port
		port: 8089,

		// cli runner port
		runnerPort: 9101,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari
		// - PhantomJS
		browsers: ['PhantomJS'],

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};
