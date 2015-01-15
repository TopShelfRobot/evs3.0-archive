module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
// Sass config.
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'Content/rawcss/custom-colors.css': 'scss/custom-colors.scss',
                    'Content/rawcss/dashboard.css': 'scss/dashboard.scss',
                    'Content/rawcss/registration.css': 'scss/registration.scss'
                }
            }
        },
//CSS Min config
        cssmin: {
            target: {
                files: {
                    'Content/rawcss/framework.css': ['Content/rawcss/kendo.common.min.css',
                        'Content/rawcss/kendo.common-material.core.min.css',
                        'Content/rawcss/kendo.common-material.min.css',
                        'Content/rawcss/kendo.material.min.css',
                        'Content/rawcss/kendo.material.mobile.min.css',
                        'Content/rawcss/kendo.mobile.material.min.css',
                        'Content/rawcss/kendo.dataviz.min.css',
                        'Content/rawcss/kendo.dataviz.default.min.css',
                        'Content/rawcss/kendo.dataviz.material.min.css',
                        'Content/rawcss/bootstrap.css',
                        'Content/rawcss/breeze.directives.css',
                        'Content/rawcss/toastr.css',
                        'Content/rawcss/nsPopover.custom.css',
                        'Content/rawcss/font-awesome.min.css',
                        'Content/rawcss/social-buttons.css'],
                    'Content/css/reg-style.css': ['Content/rawcss/framework.css',
                        'Content/registration.css'],
                    'Content/css/dash-style.css': ['Content/rawcss/framework.css',
                        'Content/dashboard.css']
                }
            }
        }
    });
// this is where you say, hey, I'm using that sass thing that I just created settings for.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
// this is where you have Grunt compile your sass when you type "grunt" into the terminal
    grunt.registerTask('default', ['sass']);
};