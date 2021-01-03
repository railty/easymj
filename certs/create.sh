NAME=list4d.ca
# Generate a private key
openssl genrsa -out $NAME.key 2048
# Create a certificate-signing request
openssl req -new -key $NAME.key -subj "/C=CA/ST=ON/O=game company/CN=$NAME" -out $NAME.csr

# Create a config file for the extensions
>$NAME.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $NAME # Be sure to include the domain name here because Common Name is not so commonly honoured by itself
EOF
# Create the signed certificate
openssl x509 -req -in $NAME.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out $NAME.crt -days 825 -sha256 -extfile $NAME.ext
