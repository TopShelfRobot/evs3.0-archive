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
        }
    });
// this is where you say, hey, I'm using that sass thing that I just created settings for.
    grunt.loadNpmTasks('grunt-contrib-sass');
// this is where you have Grunt compile your sass when you type "grunt" into the terminal
    grunt.registerTask('default', ['sass']);
};