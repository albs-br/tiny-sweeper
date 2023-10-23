@ECHO OFF

REM -- Author: https://gist.github.com/SaneMethod/5665572


@setlocal enableextensions enabledelayedexpansion
IF "%1"=="--help" GOTO Usage
IF "%1"=="/?" GOTO Usage

REM set defaults
set ini=build.ini
set csspath=../static/css/
set jspath=../static/js/
set jsout=../static/js/compiled.js
set cssout=../static/css/compiled.css
set js=
set css=

:GetParams
REM -- Get command line parameters - see usage to determine what each does --
IF "%1"=="" GOTO GetJavaHome
IF "%1"=="-j" set JAVA_HOME=%2
IF "%1"=="-i" set ini=%2
IF "%1"=="--jspath" set jspath=%2
IF "%1"=="--csspath" set csspath=%2
IF "%1"=="--jsout" set jsout=%2
IF "%1"=="--cssout" set cssout=%2
SHIFT
SHIFT
GOTO GetParams

:GetJavaHome
REM -- Determine where Java is --
REM -- IF JAVA_HOME isn't set, ask the user to give us a path --
IF "%JAVA_HOME%" == "" (
    echo Enter path to Java base directory, where the bin directory resides:
    set /p JAVA_HOME=
)
REM -- We should have JAVA_HOME by now - compile javascript and css based --
REM -- on settings in build.ini --
FOR /F "tokens=1,2 delims==, " %%i IN (%ini%) DO (
    IF "%%i"=="js" set js=!js!--js=%jspath%%%j 
    IF "%%i"=="css" set css=!css!%csspath%%%j 
)
echo !js!
echo !css!
"%JAVA_HOME%bin\java" -jar compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS !js! --js_output_file=%jsout%
"%JAVA_HOME%bin\java" -jar compiler_css.jar --allow-unrecognized-functions !css! -o %cssout%

GOTO End
:Usage
echo.
echo --Usage--
echo build -j "path/to/java" -i "path/to/ini" --jspath "path/to/js/files" --csspath "path/to/css/files" --jsout "path/to/js/output.js" --cssout "path/to/css/output.css"
echo.
echo --Params--
echo Note: All parameters are optional
echo.
echo -j  	Specify path to java, where 'bin' directory resides\
echo -i		Specfiy path and filename of ini file (default build.ini)
echo --jspath	Specify path to the js files whose names are defined in the ini file
echo --csspath	As above, for css files
echo --jsout	Specify output path and filename for the compiled js file
echo --cssout	As above, for css
echo.
:End