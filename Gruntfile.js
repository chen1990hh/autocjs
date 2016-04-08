module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= Simple & Fast to create a table of contents menu for your article. %> */\n'
      },
      files: {
        src: [
          'src/<%= pkg.name %>.js',
          'src/<%= pkg.name %>.css'
        ],
        dest: [
          'dest/<%= pkg.name %>.min.js',
          'dest/<%= pkg.name %>.min.css'
        ]
      }
    }
  });

  // 加载包含 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify']);

};