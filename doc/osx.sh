sudo scutil --set ComputerName "newname"
sudo scutil --set LocalHostName "newname"
sudo scutil --set HostName "newname"

~/.bash_profile:
export PS1='\u@\H:\w$'

sudo ln -s /usr/bin/nano /usr/local/bin/editor
