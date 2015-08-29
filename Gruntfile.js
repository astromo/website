'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);


  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    app: 'app',
    content: 'content',
    dist: 'dist',
    vendor: 'app/bower_components',

    assemble: {
      options: {
        plugins: ['assemble-markdown-pages'],
        assets: 'dist/images',
        layout: '<%= app %>/layouts/default.hbs',
        partials: '<%= app %>/partials/**/*.hbs'
      },
      website: {
        files: [{
          cwd: '<%= content %>',
          dest: '<%= dist %>/',
          expand: true,
          src: ['**/*.md']
        }]
      }
    },

    sass: {
      options: {
        includePaths: ['<%= app %>/bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'extended'
        },
        files: {
          '<%= dist %>/css/app.css': '<%= app %>/scss/app.scss',
          '<%= dist %>/css/vendor.css': '<%= app %>/scss/vendor.scss'
        }
      }
    },

    'lodash': {
      'build': {
        'dest': '<%= vendor %>/lodash-custom/lodash.build.js',
        'options': {
          'modifier': 'modern',
          'include': ['throttle']
        }
      }
    },

    clean: {
      dist: {
        src: ['<%= dist %>/*']
      },
      tmp: {
        src: ['.tmp']
      },
      post: {
        src: [
          '<%= dist %>/bower_components/**',
          '<%= dist %>/css/**/*.css',
          '<%= dist %>/js/**/*.js',
          '!<%= dist %>/js/**/*.min*.js',
          '!<%= dist %>/css/**/*.min*.css'
        ]
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app %>/',
          src: [
            'fonts/**',
            'js/**/*.js',
            '!**/*.scss',
            'bower_components/**',
            'favicon.ico',
            'robots.txt'
          ],
          dest: '<%= dist %>/'
        }]
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= app %>/',
          src: [
            'fonts/**',
            'images/**',
            'js/**',
            '!**/*.scss',
            'bower_components/**',
            'favicon.ico',
            'robots.txt'
          ],
          dest: '<%= dist %>/'
        }]
      },
      js: {
        files: [{
          expand: true,
          cwd: '<%= app %>/',
          src: [
            'js/**'
          ],
          dest: '<%= dist %>/'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= app %>',
          src: ['<%= app %>/images/**']
        }]
      }
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
        '<%= dist %>/**/*.html'
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

    filerev: {
      options: {
        algorithm: 'md5',
        length: 8
      },
      images: {
        src: '<%= dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
      },
      js: {
        src: '<%= dist %>/js/**/*.js'
      },
      css: {
        src: '<%= dist %>/css/**/*.css'
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          removeOptionalTags: true,
          useShortDoctype: true,
          minifyJS: true, // Minify inline JS
          minifyCSS: true // Minify inline css
        },
        expand: true,
        cwd: '<%= dist %>',
        src: ['**/*.html'],
        dest: '<%= dist %>/'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      grunt: {
        files: ['Gruntfile.js'],
        tasks: ['compile-sass']
      },
      sass: {
        files: '<%= app %>/scss/**/*.scss',
        tasks: ['compile-sass']
      },
      assemble: {
        files: [
          '<%= content %>/**/*.md',
          '<%= app %>/partials/**/*.hbs',
          '<%= app %>/layouts/**/*.hbs'
        ],
        tasks: ['assemble']
      },
      js: {
        files: [
          '<%= app %>/js/**/*.js'
        ],
        tasks: ['copy:js']
      },
      images: {
        files: [
          '<%= app %>/images/**/*.{jpg,gif,svg,jpeg,png}'
        ],
        tasks: ['copy:images']
      }
    },

    autoprefixer: {
      options: {},
      all: {
        expand: true,
        flatten: true,
        src: '<%= dist %>/css/*.css',
        dest: '<%= dist %>/css/'
      }
    },

    connect: {
      options: {
        port: 9000,
        base: '<%= dist %>/',
        hostname: '0.0.0.0'
      },
      app: {
        options: {
          livereload: true
        }
      },
      dist: {
        options: {
          livereload: false,
          keepalive: true
        }
      }
    }

  });


  grunt.registerTask('compile-sass', ['sass:dist', 'autoprefixer:all']);

  grunt.registerTask('serve', ['clean', 'compile-sass', 'assemble:website', 'lodash', 'copy:dev', 'connect:app', 'watch']);
  grunt.registerTask('serve:dist', ['clean', 'dist', 'connect:dist']);

  grunt.registerTask('dist', ['clean', 'compile-sass', 'assemble:website', 'useminPrepare', 'lodash', 'copy:dist', 'imagemin', 'concat', 'cssmin', 'uglify', 'filerev', 'usemin', 'htmlmin:dist', 'clean:post']);

  grunt.registerTask('default', ['serve']);

};
