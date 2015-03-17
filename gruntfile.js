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
					'Content/js/jquery-2.1.3.min.js',
					'Content/js/angular.min.js ',
					'Content/js/angular-animate.min.js ',
					'Content/js/angular-route.min.js',
					'Content/js/angular-sanitize.min.js',
					'Content/js/angular-resource.min.js',
					'Content/js/kendo.all.min.js',
					'Content/js/bootstrap.min.js',
					'Content/js/breeze.debug.js',
					'Content/js/breeze.angular.js',
					'Content/js/breeze.directives.js',
					'Content/js/breeze.saveErrorExtensions.js',
					'Content/js/jszip.min.js',
					'Content/js/jquery.validate.js',
					'Content/js/toastr.js',
					'Content/js/moment.js',
					'Content/js/spin.js',
					'Content/js/nsPopover.js',
					'Content/js/stripe.js',
					'Content/js/ngMask.js',
					'Content/js/angular-local-storage.min.js',
					'Content/js/ui-bootstrap-custom-0.12.1.min.js',
					'Content/js/ui-bootstrap-custom-tpls-0.12.1.min.js',
					'Content/js/angular-moment.js',
					'Content/js/angulartics.js',
					'Content/js/angulartics-ga.js',
					'Content/js/ng-role-auth.js'],
				dest: 'Scripts/not_in_use/concat.js',
			},
		},
		uglify: {
			options: {
				mangle: {
					except: ['jQuery', 'Backbone']
				},
				report: 'min'
			},
			my_target: {
				files: {
					'Content/built.min.js': ['Scripts/not_in_use/concat.js']
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
