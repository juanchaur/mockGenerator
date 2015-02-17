
module.exports = function (grunt) {

	grunt.config('folder_list', {
		options: {
			files: true,
			folders: false
		},

		files: {
			src: ['templates/__files/**/*'],
			dest: '.tmp/folderlist.json'
		}
	});

	grunt.loadNpmTasks('grunt-folder-list');
};