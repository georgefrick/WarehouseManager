/**
 * George Frick @brewcitycoder goerge.frick@gmail.com
 * A very simple grunt setup that can be used for Qunit Testing.
 * @param grunt
 */
module.exports = function (grunt) {

    /**
     * For testing with Qunit + Connect, you'll need to tell Qunit where your tests are when the
     * connect server is up, and you will need to configure the connect server.
     */
    var basePath = 'src/main/webapp/js/'
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // @SEE https://github.com/gruntjs/grunt-contrib-qunit
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:7171/index-tests.html'
                    ]
                }
            }
        },
        // @SEE https://github.com/gruntjs/grunt-contrib-connect
        connect: {
            server: {
                options: {
                    port: 7171,
                    base: "src/main/webapp"
                }
            }
        },
        // @SEE https://github.com/gruntjs/grunt-contrib-requirejs
        requirejs: {
            compile: {					
                options: {
                    baseUrl: basePath, 
                    name: "./main",
                    mainConfigFile: "src/main/webapp/js/main.js",
										out: "src/main/webapp/js/main-optimized.js",
										optimize: "none",
										useStrict: true
                }
            }
        }

    });


    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-requirejs');


    grunt.registerTask('default', ['connect', 'qunit', 'requirejs']);
    grunt.registerTask('test', ['connect', 'qunit']);
    grunt.registerTask('rjs', ['requirejs']);

};

    /*
if optimize
    script(src='/javascripts/main-built.js')
else
    script(src='/javascripts/vendor/require.js', data-main='/javascripts/main.js')
        */