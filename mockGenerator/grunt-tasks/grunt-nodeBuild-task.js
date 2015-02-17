
module.exports = function (grunt) {

	grunt.config('nodewebkit', {

		options: {
			platforms: ['linux64'], //['win32', 'win64', 'osx32', 'osx64', 'linux32', 'linux64'
			buildDir: 'out/', // Where the build version of my node-webkit app is saved
			cacheDir: 'out/',
			buildType: 'timestamped'
		},
		src: ['~/Desktop/mockGenerator/**/*'] // Your node-webkit app
	});

	grunt.loadNpmTasks('grunt-node-webkit-builder');
};