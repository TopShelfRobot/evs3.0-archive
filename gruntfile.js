module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'scss/frameworkcss/dashboard.css': 'scss/partials/dashboard/dashboard.scss',
					'scss/frameworkcss/registration.css': 'scss/partials/registration/registration.scss'
				}
			}
		},
		cssmin: {
			target: {
				files: {
					'scss/frameworkcss/framework.css': ['scss/rawcss/kendo.common.min.css',
	  'scss/frameworkcss/kendo.common-material.core.min.css',
	  'scss/frameworkcss/kendo.common-material.min.css',
	  'scss/frameworkcss/kendo.material.min.css',
	  'scss/frameworkcss/kendo.material.mobile.min.css',
	  'scss/frameworkcss/kendo.mobile.material.min.css',
	  'scss/frameworkcss/kendo.dataviz.min.css',
	  'scss/frameworkcss/kendo.dataviz.default.min.css',
	  'scss/frameworkcss/kendo.dataviz.material.min.css',
	  'scss/frameworkcss/breeze.directives.css',
	  'scss/frameworkcss/toastr.css',
	  'scss/frameworkcss/nsPopover.custom.css',
	  'scss/frameworkcss/font-awesome.min.css'],
					'Content/css/registration.css': ['scss/frameworkcss/framework.css',
	  'scss/frameworkcss/registration.css'],
					'Content/css/dashboard.css': ['scss/frameworkcss/framework.css',
      'scss/frameworkcss/dashboard.css',
			'scss/frameworkcss/registration.css']
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
				dest: 'Scripts/concat.js'
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
				multistr: true,
				eqnull: true,
				ignores: 'app/**/*.min.js',
				force: true,
				validthis: true,
				expr: true,
				newcap: false,
			},
			source: ['app/**/*.js']
		},
		watch: {
			css: {
				files: ['scss/partials/**/*.scss'],
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
			}
		}
	});
	// Individual tasks
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//Watch task
	grunt.loadNpmTasks('grunt-contrib-watch');
	// Default grunt tasks
	grunt.registerTask('default', ['jshint', 'sass', 'cssmin', 'concat', 'uglify']);
};
