netsh interface portproxy show all

netsh interface portproxy delete v4tov4 listenport=9000 listenaddress=192.168.86.200
netsh interface portproxy add v4tov4 listenport=9000 listenaddress=192.168.86.200 connectport=8000 connectaddress=localhost

netsh interface portproxy delete v4tov4 listenport=9001 listenaddress=192.168.86.201
netsh interface portproxy add v4tov4 listenport=9001 listenaddress=192.168.86.201 connectport=8001 connectaddress=localhost

netsh interface portproxy delete v4tov4 listenport=9002 listenaddress=192.168.86.201
netsh interface portproxy add v4tov4 listenport=9002 listenaddress=192.168.86.201 connectport=8002 connectaddress=localhost

netsh interface portproxy delete v4tov4 listenport=9003 listenaddress=192.168.86.203
netsh interface portproxy add v4tov4 listenport=9003 listenaddress=192.168.86.203 connectport=8003 connectaddress=localhost

netsh interface portproxy delete v4tov4 listenport=9004 listenaddress=192.168.86.203
netsh interface portproxy add v4tov4 listenport=9004 listenaddress=192.168.86.203 connectport=8004 connectaddress=localhost
