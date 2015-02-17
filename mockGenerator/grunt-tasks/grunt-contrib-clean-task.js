
module.exports = function (grunt) {

	grunt.config('clean', {
		folderList: ['.tmp']
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
};