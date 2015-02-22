'use strict';

var path = require('path');

module.exports = function( grunt ) {
	grunt.initConfig({
		pkg: grunt.file.readJSON( 'package.json' ),

		// rules for compiling the less
		less: {
			development: {
			  files: {
			    'app/styles/app.css': 'app/styles/less/bootstrap.less', 
			  }
			}
		},

	});

	// run the tasks in this order
	grunt.registerTask( 'default', ['less'] );

	// npm depenancies to include here
	grunt.loadNpmTasks('grunt-contrib-less');
};