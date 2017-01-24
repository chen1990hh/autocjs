module.exports = function ( grunt ) {

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        uglify: {
            options: {
                banner: '/* \n AutocJS - <%=pkg.description%> \n Copyright (c) 2016 yaohaixiao, all right reserved. \n homepage: <%=pkg.homepage%> \n version: <%=pkg.version%> \n author: <%=pkg.author%>  \n license: <%=pkg.license%> \n */\n'
            },
            build: {
                src: 'src/autoc.js',
                dest: 'build/autoc.min.js'
            }
        },
        cssmin: {
            options: {
                sourceMap: true
            },
            build: {
                src: 'src/autoc.css',
                dest: 'build/autoc.min.css'
            }
        },
        csslint: {
            test: {
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
            test: {
                options: {
                    '-W015': true
                },
                src: [ 'src/*.js' ],
                filter: 'isFile'
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-csslint' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );

    // 注册任务
    grunt.registerTask( 'default', [ 'uglify', 'cssmin', 'csslint', 'jshint' ] );

};