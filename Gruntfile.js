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
        // Este plugin es malo solo puede con un fichero a la vez
        htmlmin: {
            prod: {
                options: {
                    // removeComments: true,
                    collapseWhitespace: true,
                    preserveLineBreaks: true,

                    // minifyJS: true,
                    // minifyCSS: true,
                },
                files: [{
                    expand: true,
                    // src: ['docs/**/*.html', 'docs/*.html'],
                    cwd: '.',
                    src: ['docs/_includes/scripts.html'],
                    // The dest value should be whatever the src glob
                    // pattern is, without the trailing /**/*.html part 
                    dest: 'docs',
    
                    cwd: '.',
                    rename: function (dst, src) {
                        return src;
                    }
                }]
            }
        },
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
                    src: ['docs/*.js', 'docs/assets/scripts/**/*.js', '!docs/**/*.min.js'],

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
                    cwd: '.',
                    src: ['docs/assets/styles/**/*.css', '!docs/assets/styles/**/*.min.css'],
                    // The dest value should be whatever the src glob
                    // pattern is, without the trailing /**/*.js part 
                    dest: 'docs',

                    cwd: '.',
                    rename: function (dst, src) {
                        return src;
                    }

                }]
            }
        }
    });

    // Load required modules
    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-remove-comments');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Task definitions
    // grunt.registerTask('default', ['concat']);
    grunt.registerTask('prod', ['htmlmin:prod', 'remove_comments:prod_js', 'remove_comments:prod_css', 'uglify:prod', 'cssmin:prod']);

};