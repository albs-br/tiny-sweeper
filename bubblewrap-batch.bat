REM bubblewrap init --manifest=http://albs-br.github.io/tiny-sweeper/manifest.json


REM If this build end with error, try closing programs to free memory, it runs a VM that uses a large amount of RAM
bubblewrap build
