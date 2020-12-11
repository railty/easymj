"certbot renew"

#list certificates
certbot certificates

#delete certificates
certbot delete

#some certificates has multiple domains, such as mj.com and www.mj.com
sudo certbot -d easymj.games -d www.easymj.games

#others has just 1, do it indivadually
sudo certbot -d hall.easymj.games
sudo certbot -d gamel.easymj.games
sudo certbot -d act.easymj.games
