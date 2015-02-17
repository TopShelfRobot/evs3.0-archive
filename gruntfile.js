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
					'Content/css/custom-colors.css': 'scss/custom-colors.scss',
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
                        'scss/rawcss/dashboard.css',
												'scss/rawcss/registration.css']
				}
			}
		},
		jshint: {
			options: {
				multistr: true,
				eqnull: true,
				ignores: "app/**/*.min.js"
			},
			source: [
				"app/**/*.js"
			]
		},
		watch: {
			css: {
				files: ['scss/*.scss', 'scss/partials/*.scss'],
				tasks: ['sass', 'cssmin'],
				options: {
					spawn: false,
				},
			},
		}
	});
	// Individual tasks
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// Default grunt tasks
	grunt.registerTask('default', ['sass','cssmin', "jshint"]);
};
