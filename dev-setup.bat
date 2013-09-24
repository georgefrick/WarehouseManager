
REM George Frick @brewcitycoder george.frick@gmail.com

REM Let's use Node, Grunt and Qunit to test our front-end when
REM we build.

REM Install Node first and have it in your %PATH%
REM @SEE http://nodejs.org/

REM ******************** RequireJS For Node ******************
REM @SEE http://requirejs.org/docs/optimization.html
call npm install -g requirejs

REM ******************** Install grunt if you don't have it **
REM @SEE http://gruntjs.com
call npm install -g grunt-cli

REM ******************** Setup Grunt in your project *********
REM @SEE http://gruntjs.com/getting-started
call npm install grunt --save-dev

REM ******************** Local Web Server ********************
REM @SEE https://github.com/gruntjs/grunt-contrib-connect
call npm install grunt-contrib-connect --save-dev

REM ******************** Qunit Driver (With PhantomKS) *******
REM @SEE https://github.com/gruntjs/grunt-contrib-qunit
call npm install grunt-contrib-qunit --save-dev

REM ******************** R.js (RequireJS) Driver *************
REM @SEE https://github.com/gruntjs/grunt-contrib-requirejs
call npm install grunt-contrib-requirejs --save-dev

REM When this returns your node_modules folder should have:
REM 1. grunt_contrib_qunit
REM 2. grunt_contrib_connect
REM 3. grunt