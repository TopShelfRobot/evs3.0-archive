module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Sass config.
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'scss/rawcss/dashboard.css': 'scss/dashboard.scss',
					'scss/rawcss/registration.css': 'scss/registration.scss'
				}
			}
		},
		//CSS Min config
		cssmin: {
			target: {
				files: {
					'scss/rawcss/framework.css': ['scss/rawcss/kendo.common.min.css',
      'scss/rawcss/kendo.common-material.core.min.css',
      'scss/rawcss/kendo.common-material.min.css',
      'scss/rawcss/kendo.material.min.css',
      'scss/rawcss/kendo.material.mobile.min.css',
      'scss/rawcss/kendo.mobile.material.min.css',
      'scss/rawcss/kendo.dataviz.min.css',
      'scss/rawcss/kendo.dataviz.default.min.css',
      'scss/rawcss/kendo.dataviz.material.min.css',
      'scss/rawcss/bootstrap.css',
      'scss/rawcss/breeze.directives.css',
      'scss/rawcss/toastr.css',
      'scss/rawcss/nsPopover.custom.css',
      'scss/rawcss/font-awesome.min.css',
      'scss/rawcss/social-buttons.css'],
					'Content/css/reg-style.css': ['scss/rawcss/framework.css',
      'scss/rawcss/registration.css'],
					'Content/css/dash-style.css': ['scss/rawcss/framework.css',
            'scss/rawcss/registration.css',
      'scss/rawcss/dashboard.css']
				}
			}
		},
		//Static Server
		connect: {
			server: {
				options: {
					port: 9000,
					keepalive: true
				}
			}
		},
		concat: {
			options: {
				stripBanners: true
			},
			dist: {
				src: [
					'Scripts/js/angular-animate.js ',
					'Scripts/js/angular-route.js',
					'Scripts/js/angular-sanitize.js',
					'Scripts/js/angular-resource.js',
					'Scripts/js/breeze.debug.js',
					'Scripts/js/breeze.angular.js',
					'Scripts/js/breeze.directives.js',
					'Scripts/js/breeze.saveErrorExtensions.js',
					'Scripts/js/jszip.js',
					'Scripts/js/jquery.validate.js',
					'Scripts/js/toastr.js',
					'Scripts/js/moment.js',
					'Scripts/js/spin.js',
					'Scripts/js/stripe.js',
					'Scripts/js/ngMask.js',
					'Scripts/js/nsPopover.js',
					'Scripts/js/angular-local-storage.js',
					'Scripts/js/angular-moment.js',
					'Scripts/js/angulartics.js',
					'Scripts/js/angulartics-ga.js',
					'Scripts/js/ng-role-auth.js'],
				dest: 'Scripts/concat.js',
			},
		},
		uglify: {
			options: {
				mangle: {
					except: ['jQuery', 'Angular']
				},
				report: 'min'
			},
			my_target: {
				files: {
					'Content/js/built.min.js': ['Scripts/concat.js']
				}
			}
		},
		jshint: {
			options: {
				'bitwise': true,
				'camelcase': true,
				'curly': true,
				'eqeqeq': true,
				'es3': false,
				'forin': true,
				'freeze': true,
				'immed': true,
				'indent': 4,
				'latedef': 'nofunc',
				'newcap': false,
				'noarg': true,
				'noempty': true,
				'nonbsp': true,
				'nonew': true,
				'plusplus': false,
				'quotmark': 'single',
				'undef': true,
				'unused': false,
				'strict': false,
				'maxparams': 10,
				'maxdepth': 5,
				'maxstatements': 40,
				'maxcomplexity': 8,
				'maxlen': 420,

				'asi': false,
				'boss': false,
				'debug': false,
				'eqnull': true,
				'esnext': false,
				'evil': false,
				'expr': false,
				'funcscope': false,
				'globalstrict': false,
				'iterator': false,
				'lastsemic': false,
				'laxbreak': false,
				'laxcomma': false,
				'loopfunc': true,
				'maxerr': false,
				'moz': false,
				'multistr': false,
				'notypeof': false,
				'proto': false,
				'scripturl': false,
				'shadow': false,
				'sub': true,
				'supernew': false,
				'validthis': true,
				'noyield': false,

				'browser': true,
				'devel': true,
				'node': true,

				'globals': {
					'angular': false,
					'$': false,
					'toastr': false,
					'moment': false,
					'kendo': false
				}
			},
			source: ['app/**/*.js']
		},
		watch: {
			css: {
				files: ['scss/*.scss', 'scss/partials/*.scss'],
				tasks: ['sass', 'cssmin'],
				options: {
					spawn: false,
				},
			},
			concat: {
				files: ['Scripts/js/*.js'],
				tasks: ['concat']
			},
			uglify: {
				files: ['Scripts/concat.js'],
				tasks: ['concat']
			},
			jshint: {
				files: ['app/**/*.js'],
				tasks: ['jshint'],
			},
		}
	});
	// Individual tasks
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// Default grunt tasks
	grunt.registerTask('default', ['sass', 'cssmin', 'concat', 'uglify']);
};
