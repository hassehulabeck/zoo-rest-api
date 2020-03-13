# Ett REST API för en mindre djurpark
## Gör så här
1. Plocka ner filerna, kör en ``` NPM INSTALL ```
2. Skapa en databas som heter "zoo"
3. Skapa en användare som har rättigheter till denna.
4. Skriv in användarens username och password i ```routes.js```

God tur.

## Gällande sequrity by api-key in db.
1. Skapa en databas-tabell som heter "users".
2. Den ska ha kolumnerna id INT AUTO_INCREMENT PRIMARY KEY samt apikey VARCHAR(30)
3. Man kan också lägga till ytterligare en kolumn för vilken roll innehavaren av api-nyckeln har (0=read, 1=read & post, 2=read, post, put, patch, delete) 
Den kolumnen kan då heta role SMALLINT och ha ett av dessa värden. Bra att lägga till en kommentar i databasen om detta, så att man vet vad siffrorna betyder.

