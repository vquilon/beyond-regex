module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        // concat: {
        //     "options": { "separator": ";" },
        //     "build": {
        //         "src": ["js/file1.js", "js/file2.js"],
        //         "dest": "js/app.js"
        //     }
        // },
        remove_comments: {
            options: {
                // Task-specific options go here.
            },
            prod_js: {
                options: {
                    multiline: true,
                    singleline: true,
                    keepSpecialComments: false
                },
                cwd: 'docs',
                src: '**/*.js',
                expand: true,
                dest: 'docs'
            },
            prod_css: {
                options: {
                    multiline: true,
                    singleline: true,
                    keepSpecialComments: true,
                    linein: true,
                    isCssLinein: true
                },
                cwd: 'docs',
                src: '**/*.css',
                expand: true,
                dest: 'docs'
            },
        },
        uglify: {
            prod: { // <-- include a target object
                files: [{
                    expand: true,
                    src: ['docs/**/*.js', '!docs/**/*.min.js'],

                    // The dest value should be whatever the src glob
                    // pattern is, without the trailing /**/*.js part 
                    dest: 'docs',

                    cwd: '.',
                    rename: function (dst, src) {
                        return src;
                    }
                }]
            }
        },
        cssmin: {
            prod: {
                files: [{
                    expand: true,
                    cwd: 'docs',
                    src: ['*.css', '!*.min.css'],
                    dest: 'docs',
                    // ext: '.min.css'
                    ext: '.min.css'

                }]
            }
        }
    });

    // Load required modules
    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-remove-comments');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Task definitions
    // grunt.registerTask('default', ['concat']);
    grunt.registerTask('prod', ['remove_comments:prod_js', 'remove_comments:prod_css', 'uglify:prod', 'cssmin:prod']);

};