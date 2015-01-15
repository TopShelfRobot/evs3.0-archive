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
                    'Content/custom-colors.css': 'scss/custom-colors.scss',
                    'Content/dashboard.css': 'scss/dashboard.scss',
                    'Content/registration.css': 'scss/registration.scss'
                }
            }
        },
//CSS Min config
        cssmin: {
            target: {
                files: {
                    'Content/framework.css': ['Content/kendo.common.min.css',
                        'Content/kendo.common-material.core.min.css',
                        'Content/kendo.common-material.min.css',
                        'Content/kendo.material.min.css',
                        'Content/kendo.material.mobile.min.css',
                        'Content/kendo.mobile.material.min.css',
                        'Content/kendo.dataviz.min.css',
                        'Content/kendo.dataviz.default.min.css',
                        'Content/kendo.dataviz.material.min.css',
                        'Content/bootstrap.css',
                        'Content/breeze.directives.css',
                        'Content/toastr.css',
                        'Content/nsPopover.custom.css',
                        'Content/font-awesome.min.css',
                        'Content/social-buttons.css'],
                    'css/reg-style.css': ['Content/framework.css',
                        'Content/registration.css'],
                    'css/dash-style.css': ['Content/framework.css',
                        'Content/dashboard.css']
                }
            }
        },
// Uglify Vendor Scripts
            uglify: {
                my_target: {
                    files: [{
                        expand: true,
                        cwd: 'scripts',
                        src: 'scripts/*.js',
                        dest: 'scripts'
                    }]
                }
            }
    });
// this is where you say, hey, I'm using that sass thing that I just created settings for.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
// this is where you have Grunt compile your sass when you type "grunt" into the terminal
    grunt.registerTask('default', ['sass']);
};