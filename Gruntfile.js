module.exports = function ( grunt ) {

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        uglify: {
            options: {
                banner: '/* \n AutocJS - <%=pkg.description%> \n Copyright (c) 2016 yaohaixiao, all right reserved. \n homepage: <%=pkg.homepage%> \n version: <%=pkg.version%> \n author: <%=pkg.author%>  \n license: <%=pkg.license%> \n */\n'
            },
            js: {
                src: 'src/<%=pkg.name%>.js',
                dest: 'build/<%=pkg.name%>.min.js'
            }
        },
        cssmin: {
            css: {
                src: 'src/<%=pkg.name%>.css',
                dest: 'build/<%=pkg.name%>.min.css'
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

    grunt.registerTask( 'default', [ 'uglify', 'cssmin' ] );

};