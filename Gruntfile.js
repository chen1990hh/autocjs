module.exports = function ( grunt ) {

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        connect: {
            api: {
                options: {
                    port: 8080,
                    hostname: 'localhost',
                    livereload: true,
                    base: {
                        path: './docs/',
                        options: {
                            index: 'index.htm'
                        }
                    }
                }
            }
        },
        uglify: {
            options: {
                banner: '/* \n AutocJS - <%=pkg.description%> \n Copyright (c) 2016 yaohaixiao, all right reserved. \n homepage: <%=pkg.homepage%> \n version: <%=pkg.version%> \n author: <%=pkg.author%>  \n license: <%=pkg.license%> \n */\n'
            },
            compress: {
                files: {
                    'build/autoc.min.js': 'src/autoc.js'
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            compress: {
                files: {
                    'build/autoc.min.css': [ 'src/autoc.css' ]
                }
            }
        },
        csslint: {
            check: {
                options: {
                    "bulletproof-font-face": false,
                    "order-alphabetical": false,
                    "box-model": false,
                    "vendor-prefix": false,
                    "known-properties": false
                },
                src: [ 'src/*.css' ]
            }
        },
        jshint: {
            check: {
                options: {
                    jshintrc: '.jshintrc'
                },
                src: [ 'src/*.js' ],
                filter: 'isFile'
            }
        },
        copy: {
            js: {
                files: [
                    {
                        'docs/js/autoc.js': 'src/autoc.js'
                    }
                ]
            },
            css: {
                files: [
                    {
                        'docs/css/autoc.css': 'src/autoc.css'
                    }
                ]
            }
        },
        watch: {
            js: {
                files: [ 'src/*.js' ],
                tasks: [ 'jshint:check', 'copy:js', 'uglify:compress' ]
            },
            css: {
                files: [ 'src/*.css' ],
                tasks: [ 'csslint:check', 'copy:css', 'cssmin:compress' ]
            },
            api: {
                files: [
                    'docs/js/*.js',
                    'docs/css/*.css'
                ],
                options: {
                    livereload: true
                }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-connect' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-csslint' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    // 注册任务
    grunt.registerTask( 'default', [
        'connect:api',
        'uglify',
        'cssmin',
        'csslint',
        'jshint',
        'copy',
        'watch'
    ] );
};