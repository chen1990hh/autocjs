module.exports = function ( grunt ) {

    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        uglify: {
            js: {
                src: 'src/autoc.js',
                dest: 'build/autoc.min.js'
            }
        },
        cssmin: {
            css: {
                src: 'src/autoc.css',
                dest: 'build/autoc.min.css'
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );

    grunt.registerTask( 'default', [ 'uglify', 'cssmin' ] );

};