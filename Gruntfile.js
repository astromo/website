'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    dist: 'dist',

    sass: {
      options: {
        includePaths: ['<%= app %>/bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'extended'
        },
        files: {
          '<%= app %>/css/app.css': '<%= app %>/scss/app.scss',
          '<%= app %>/css/vendor.css': '<%= app %>/scss/vendor.scss'
        }
      }
    },

    clean: {
      dist: {
        src: ['<%= dist %>/*']
      },
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app %>/',
          src: [
            'fonts/**',
            '**/*.html',
            '!**/*.scss',
            '!bower_components/**',
            'favicon.ico',
            'robots.txt'
          ],
          dest: '<%= dist %>/'
        }]
      },
    },

    imagemin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= app %>/images/',
          src: ['**/*.{jpg,gif,svg,jpeg,png}'],
          dest: '<%= dist %>/images/'
        }]
      }
    },

    uglify: {
      options: {
        preserveComments: 'some',
        mangle: false
      }
    },

    useminPrepare: {
      html: [
        '<%= app %>/*.html'
      ],
      options: {
        dest: '<%= dist %>'
      }
    },

    usemin: {
      html: ['<%= dist %>/**/*.html', '!<%= app %>/bower_components/**'],
      css: ['<%= dist %>/css/**/*.css'],
      options: {
        dirs: ['<%= dist %>']
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['compile-sass']
      },
      sass: {
        files: '<%= app %>/scss/**/*.scss',
        tasks: ['compile-sass']
      },
      livereload: {
        files: ['<%= app %>/**/*.html', '!<%= app %>/bower_components/**', '<%= app %>/js/**/*.js', '<%= app %>/css/**/*.css', '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}'],
        options: {
          livereload: true
        }
      }
    },

    autoprefixer: {
      options: {},
      all: {
        expand: true,
        flatten: true,
        src: 'app/css/*.css',
        dest: 'app/css/'
      }
    },

    connect: {
      app: {
        options: {
          port: 9000,
          base: '<%= app %>/',
          livereload: true,
          hostname: '0.0.0.0'
        }
      },
      dist: {
        options: {
          port: 9001,
          base: '<%= dist %>/',
          keepalive: true,
          livereload: false,
          hostname: '0.0.0.0'
        }
      }
    }

  });


  grunt.registerTask('compile-sass', ['sass', 'autoprefixer:all']);
  grunt.registerTask('compile-sass', ['sass:dist', 'autoprefixer:all']);

  grunt.registerTask('default', ['compile-sass', 'connect:app', 'watch']);
  grunt.registerTask('server-dist', ['connect:dist']);

  grunt.registerTask('dist', ['compile-sass:dist', 'clean:dist', 'useminPrepare', 'copy:dist', 'newer:imagemin', 'concat', 'cssmin', 'uglify', 'usemin']);

};
