echo "
rdr pass on lo0 inet proto tcp from any to self port 9000 -> 127.0.0.1 port 8000
rdr pass on lo0 inet proto tcp from any to self port 9001 -> 127.0.0.1 port 8001
rdr pass on lo0 inet proto tcp from any to self port 9002 -> 127.0.0.1 port 8002
rdr pass on lo0 inet proto tcp from any to self port 9003 -> 127.0.0.1 port 8003
rdr pass on lo0 inet proto tcp from any to self port 9004 -> 127.0.0.1 port 8004
" | sudo pfctl -ef -