'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    neuter: {
      options: {
        includeSourceURL: false,
        separator:'\n',
        template:'{%= src %}'
      },
      'dist/<%= pkg.name %>.js': 'lib/<%= pkg.name %>.js'
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    jasmine: {
      pivotal: {
        src: 'dist/bindable.js',
        options: {
          specs: 'spec/**/*_spec.js',
          helpers: 'spec/**/*_helper.js'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        jshintignore:'.jshintignore'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        options: {
          jshintrc: 'lib/.jshintrc'
        },
        src: ['lib/**/*.js']
      },
    },
    watch: {
      test : {
        files: ['lib/**/*.js', 'spec/**/*_spec.js'],
        tasks: 'test'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-neuter');

  grunt.registerTask('build', 'Build for given environment.', function(env){
    if(typeof(env)==='undefined'){
      env = 'development';
    }
    
    var tasks = ['jshint', 'neuter', 'jasmine'];
    if(env === 'distribution'){
      grunt.config.set('neuter.options.includeSourceURL', false);
      tasks.push('uglify');
    }
    grunt.task.run(tasks);
  });
  
  grunt.registerTask('test', ['jshint', 'neuter', 'jasmine']);

  // Default task.
  grunt.registerTask('default', ['test']);

};
