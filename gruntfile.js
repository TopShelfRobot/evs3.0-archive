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
					'bower_components/angular-latest/src/ngAnimate/animate.js ',
					'bower_components/angular-latest/src/ngRoute/route.js',
					'bower_components/angular-latest/src/ngRoute/routeParams.js',
					'bower_components/angular-latest/src/ngRoute/directive/ngView.js',
					'bower_components/angular-latest/src/ngSanitize/sanitize.js',
					'bower_components/angular-latest/src/ngResource/resource.js',
					'bower_components/breeze-client/build/adapters/breeze.bridge.angular.js',
					'bower_components/breeze-client-labs/breeze.directives.js',
					'bower_components/breeze-client-labs/breeze.saveErrorExtensions.js',
					'bower_components/jszip/dist/jszip.js',
					'bower_components/jquery-validation/dist/jquery.validate.js',
					'bower_components/toastr/toastr.js',
					'bower_components/moment/moment.js',
					'bower_components/spin.js/spin.js',
					'bower_components/angular-ngMask/dist/ngMask.js',
					'bower_components/nsPopover/src/nsPopover.js',
					'bower_components/angular-local-storage/dist/angular-local-storage.js',
					'bower_components/angular-moment/angular-moment.js',
					'bower_components/angulartics/src/angulartics.js',
					'bower_components/angulartics/src/angulartics-ga.js',
					'bower_components/ng-role-auth/dist/ng-role-auth.js',
					'bower_components/ngmap/build/scripts/ng-map.js'],
				dest: 'Scripts/concat.js'
			},
		},
		uglify: {
			options: {
				mangle: {
					except: ['jQuery', 'Angular', 'breeze']
				},
				report: 'min'
			},
			my_target: {
				files: {
					'Content/js/built.min.js': ['Scripts/concat.js']
				}
			}
		},
		copy: {
			main: {
				src: 'bower_components/breeze-client/build/breeze.debug.js',
				dest: 'Content/js/breeze.debug.js',
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
	grunt.loadNpmTasks('grunt-preen');
	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	//Watch task
	grunt.loadNpmTasks('grunt-contrib-watch');
	// Default grunt tasks
	grunt.registerTask('default', ['preen', 'jshint', 'sass', 'cssmin', 'copy', 'concat', 'uglify']);
};
