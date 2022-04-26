/* 
1. npm init -y
2. npm i express mongodb cors dotenv
3. create index.js file
4. const express = require("express");
5. const cors = require('cors');
6. Port declare
7. require("dotenv").config(); to secure
8. app.use(cors());
   app.use(express.json());
9. write script (
    app.get("/", (req, res) => {
    res.send("Server running");
    });

    app.listen(port, () => {
        console.log("port kaj kortese", port);
    });
)   
10. create .env file
11. create database in mongodb
12. connect database
13. put password and username to the .env file
14. find multiple from mongodb
15. const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
16. find one from mongodb,
17. const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query)
18. insert one from mongodb
19. const newService = req.body;
            const result = await serviceCollection.insertOne(newService);            
*/
