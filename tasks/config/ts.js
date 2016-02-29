/**
 * Compile files with TypeScript
 *
 * ---------------------------------------------------------------
 *
 */
module.exports = function(grunt) {

	grunt.config.set('ts', {
		default: {
      src: ['app/**/*.ts', 'typings/browser.d.ts'],
      outDir: '.tmp/public/app',
      options: {
        target: 'es5',
        module: 'system',
        moduleResolution: 'node',
        sourceMap: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        removeComments: false,
        noImplicitAny: false,
        fast: 'never'
      }
    }
	});

	grunt.loadNpmTasks('grunt-ts');
};
