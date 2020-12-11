C:\CocosDashboard_1.0.10\resources\.editors\Creator\2.4.3\CocosCreator.exe --path ..\client\ --build "platform=web-mobile;debug=false;sourceMaps=false;md5Cache=true;encryptJs=true;autoCompile=true;embedWebDebugger=false"
rem % eascped to %% in windows batch
ssh mj "cd easymj/public && mv web-mobile web-mobile`date +'_%%Y-%%m-%%d-%%H-%%M-%%S'`  && ls -l "
scp -r ..\public\web-mobile\ mj:easymj/public/



