const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");

require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { send } = require("express/lib/response");
const port = process.env.PORT || 4000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden access" });
        }
        console.log("Decoded", decoded);
        req.decoded = decoded;
        next();
    });
}

// mongodb part starts
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khsoz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db("geniusCar").collection("service");
        const orderCollection = client.db("geniusCar").collection("order");

        // AUTH
        app.post("/login", async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(
                user,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            res.send({ accessToken });
        });

        // get all data
        app.get("/service", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        // find specific post with id
        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //set post data
        app.post("/service", async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        // delete specific post with id
        app.delete("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });

        app.get("/order", verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            if (email === decodedEmail) {
                const query = { email };
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            } else {
                res.status(403).send({ message: "forbidden access" });
            }
        });

        app.post("/order", async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });
    } finally {
    }
}
run().catch(console.dir);
//mongodb parts ends

app.get("/", (req, res) => {
    res.send("Server running");
});

app.listen(port, () => {
    console.log("port kaj kortese", port);
});