netsh interface portproxy show all

netsh interface portproxy delete v4tov4 listenport=9000 listenaddress=127.0.0.1
netsh interface portproxy add v4tov4 listenport=9000 listenaddress=127.0.0.1 connectport=8000 connectaddress=127.0.0.1

netsh interface portproxy delete v4tov4 listenport=9001 listenaddress=127.0.0.1
netsh interface portproxy add v4tov4 listenport=9001 listenaddress=127.0.0.1 connectport=8001 connectaddress=127.0.0.1

netsh interface portproxy delete v4tov4 listenport=9002 listenaddress=127.0.0.1
netsh interface portproxy add v4tov4 listenport=9002 listenaddress=127.0.0.1 connectport=8002 connectaddress=127.0.0.1

netsh interface portproxy delete v4tov4 listenport=9003 listenaddress=127.0.0.1
netsh interface portproxy add v4tov4 listenport=9003 listenaddress=127.0.0.1 connectport=8003 connectaddress=127.0.0.1
