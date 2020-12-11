#you only need run this once to create root ca
## root ca
openssl genrsa -out rootCA.key 2048
# use -des to have a password for the key
# openssl genrsa -des3 -out rootCA.key 2048

# Generate root certificate
#openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 825 -subj "/C=CA/ST=ON/O=game company/CN=Root CA" -out rootCA.pem
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 825 -subj "/C=CA/ST=ON/O=game company/CN=Root CA" -out rootCA.crt




