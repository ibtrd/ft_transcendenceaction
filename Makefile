

SSL_CERTIFICATE = secrets/localhost.crt secrets/localhost.key

$(SSL_CERTIFICATE):
	mkdir -p $(@D)
	openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out secrets/localhost.crt \
            -keyout secrets/localhost.key \
            -subj "/C=FR/ST=Rhone-Alpes/L=Lyon/O=YATT/OU=IT Department/CN=www.localhost.com"
