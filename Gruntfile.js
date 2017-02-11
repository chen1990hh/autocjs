module.exports = function ( grunt ) {

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        connect: {
            server: {
                options: {
                    port: 8080,
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
                    'build/autoc.min.css': ['src/autoc.css']
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
        watch: {
            uglify: {
                files: ['src/*.js'],
                tasks:['uglify:compress']
            },
            cssmin: {
                files: ['src/*.css'],
                tasks: ['cssmin:compress']
            },
            csslint: {
                files: ['src/*.css'],
                tasks: ['csslint:check']
            },
            jslint: {
                files: ['src/*.js'],
                tasks: ['jshint:check']
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-connect' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-csslint' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    // 注册任务
    grunt.registerTask( 'default', [ 'connect:server', 'uglify', 'cssmin', 'csslint', 'jshint', 'watch'] );

}