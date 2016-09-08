module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 9000,
          base: 'dist',
          hostname: 'localhost',
          livereload: true,
          open: false
        }
      }
    },

    watch: {
      handlebars: {
        files: ['src/templates/**/*.hbs', 'src/templates/**/*.json', 'src/templates/layout.html '],
        tasks: ['handlebarslayouts', 'inlinecss']
      },
      sass: {
        files: ['src/styles/**/*.scss'],
        tasks: ['sass', 'postcss']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint', 'uglify', 'concat', 'clean:temp']
      },
      assets: {
        files: ['src/public/**/*'],
        tasks: ['copy']
      },
      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['build']
      },
      options: {
        livereload: true,
      }
    },

    handlebarslayouts: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/templates/',
          src: ['**/*.hbs', '!partials/*'],
          dest: 'dist/',
          ext: '.html',
        }],
        options: {
          partials: ['src/templates/partials/*.hbs', 'src/templates/layout.html'],
          basePath: 'src/templates/',
          modules: ['src/templates/helpers/helpers-*.js'],
          context: {
            // formLink: '/can-I-transfer-my-UK-pension-to-Australian-super',
            formLink: '/form',
            formTitle: 'Can I transfer my UK Pension to Australian Super?',
            pathPensionTransferGuide: '/assets/PDF/Pension-Transfer-Guide-by-FinSec-PTX.pdf'
          }
        }
      }
    },

    sass: {
      options: {
        sourcemap: 'none',
        noCache: true
      },
      raw: {
        options: {
          style: 'expanded',
        },
        files: {
          'dist/assets/css/main.css': ['src/styles/main.scss']
        }
      },
      minified: {
        options: {
          style: 'compressed',
        },
        files: {
          'dist/assets/css/main.min.css': ['src/styles/main.scss']
        }
      }
    },

    postcss: {
      options: {
        map: false,
        processors: [
          require('pixrem')(),
          require('autoprefixer')({
            browsers: ['> 1% in AU', 'IE > 9']
          })
        ]
      },
      raw: {
        src: 'dist/assets/css/main.css'
      },
      minified: {
        src: 'dist/assets/css/main.min.css'
      }
    },

    jshint: {
      files: ['src/js/main.js'],
      options: {
        force: true,
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'temp/js/main.min.js': ['src/js/main.js']
        }
      }
    },

    concat: {
      options: {
        separator: ';\n\n',
      },
      raw: {
        files: {
          'dist/assets/js/main.js': [
            'bower_components/jquery/dist/jquery.min.js',
            'src/js/main.js'
          ]
        },
      },
      minified: {
        files: {
          'dist/assets/js/main.min.js': [
            'bower_components/jquery/dist/jquery.min.js',
            'temp/js/main.min.js'
          ]
        },
      },
      outdated_browser: {
        files: {
          'dist/assets/js/outdated-browser.js': [
            'bower_components/outdated-browser/outdatedbrowser/outdatedbrowser.min.js',
            'src/js/outdated-browser-init.js'
          ]
        },
      }
    },

    clean: {
      dist: {
        src: ['dist/']
      },
      temp: {
        src: ['temp/']
      }
    },

    copy: {
      main: {
        files: [{
          expand: true,
          cwd: 'src/public/',
          src: ['**'],
          dest: 'dist/'
        }]
      }
    },

    // BUG: Adds /dist to every URL...
    xml_sitemap: {
      custom_options: {
        options: {
          siteRoot: 'http://finsecptx.com/',
          changefreq: 'monthly',
          priority: '0.5',
          dest: 'dist/'
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**/*.html', '!**/google*.html'],
        }]
      }
    },

    // Temporary until sitemap bug is fixed
    replace: {
      sitemap_dist: {
        src: 'dist/sitemap.xml',
        dest: 'dist/sitemap.xml',
        replacements: [{
          from: '/dist/',
          to: '/'
        }, {
          from: '<feed>',
          to: ''
        }, {
          from: '</feed>',
          to: ''
        }]
      }
    },

    inlinecss: {
      main: {
        options: {
          removeStyleTags: false
        },
        files: [{
          src: 'dist/emails/letter-of-authority.html',
          dest: 'dist/emails/letter-of-authority-inline.html'
        }, {
          src: 'dist/emails/confirmation-email.html',
          dest: 'dist/emails/confirmation-email-inline.html'
        }]
      }
    }

  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-handlebars-layouts");
  grunt.loadNpmTasks('grunt-html-prettyprinter');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-xml-sitemap');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-inline-css');

  // Available commands
  grunt.registerTask('default', ['build', 'serve']);
  grunt.registerTask('build', ['clean:dist', 'copy', 'handlebarslayouts', 'inlinecss', 'sass', 'postcss', 'jshint', 'uglify', 'concat', 'clean:temp']);
  grunt.registerTask('sitemap', ['xml_sitemap', 'replace:sitemap_dist']);
  grunt.registerTask('serve', ['connect', 'watch']);

};
