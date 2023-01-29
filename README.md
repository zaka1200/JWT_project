# JWT_project

# JWT (JsonWebToken) :

![token-based-authentication](https://user-images.githubusercontent.com/121964432/215354130-d738d791-ee57-40a9-89ab-f4e493fda3e3.jpg)

## definition :

JSON Web Tokens (JWT) is a compact and secure way to transmit information as a JSON object between parties. JWTs are often used for authentication and authorization, as they allow one party to sign the token and another party to verify and trust its authenticity and the integrity of the information contained in it.

## JWT Structure :

The structure of a JSON Web Token (JWT) is as follows:

```
header.payload.signature
```

- Header: A JSON object that describes the type of token and the signing algorithm used.
- Payload: A JSON object that contains the claims. Claims are statements about an entity (typically, the user) and additional metadata. There are three types of claims: registered, public, and private claims.
- Signature: A string that is calculated using the header and payload, a secret key, and the algorithm specified in the header. The signature is used to verify the integrity of the token.

Here's an example:


![image](https://user-images.githubusercontent.com/121964432/215352674-4b656925-7afe-49dd-a20e-0e21ff09cac2.png)


The three parts of the JWT are separated by dots (.), and each part is Base64Url encoded. The first part (header), second part (payload), and the third part (signature) can be decoded to get the original header, payload, and signature information, respectively.

## JWT signing:

JWT signing is the process of creating a digital signature for a JWT, using a secret key and a signing algorithm. This signature acts as a tamper-evident mechanism, ensuring that the contents of the JWT have not been altered in transit.

Here's how JWT signing works:

- The header and payload of the JWT are combined into a single string using a dot (.) separator.
- The combined header and payload are then hashed using a signing algorithm and a secret key to create the signature.
- The header, payload, and signature are combined into a single string and returned as the JWT.

When a recipient receives the JWT, they can then use the same secret key and algorithm to calculate a hash of the header and payload and compare it to the signature in the JWT. If the calculated hash matches the signature, the recipient can trust that the JWT has not been altered in transit and that the information contained in the payload is genuine.

## JWT verification 

JWT verification is the process of checking the validity of a JWT. It is typically performed by the recipient of a JWT who wants to ensure that the information contained within it has not been tampered with.

Here's how JWT verification works:

- The recipient separates the header, payload, and signature of the JWT into separate components.
- The recipient uses the same signing algorithm and secret key used to sign the JWT to calculate a hash of the header and payload.
- The recipient then compares the calculated hash to the signature in the JWT. If the calculated hash matches the signature, the recipient can trust that the information in the payload is genuine and has not been altered in transit.
- If the calculated hash does not match the signature, the recipient can reject the JWT as invalid.

JWT verification can also include additional steps, such as checking the expiration time of the token, or verifying that the information contained in the payload meets certain criteria. This is typically accomplished by including claims in the JWT payload that describe the conditions under which the token is considered valid.

## security considerations:

Here are some security considerations to keep in mind when using JWTs:

- Use secure signing algorithms: Ensure that a secure signing algorithm such as HMAC SHA-256 or RSA is used to sign the JWT.

- Keep secret keys secure: Ensure that the secret key used to sign the JWT is kept secure and not accessible to unauthorized parties.

- Use short expiration times: Set a short expiration time for JWTs, to limit the period during which they can be used to access resources.

- Verify the token signature: Always verify the signature of the JWT to ensure that the contents have not been altered in transit.

- Validate the claims: Validate the claims contained in the JWT, such as the expiration time and the issuer, to ensure that they meet the desired conditions.

- Avoid using JWT in URL parameters: Do not include JWTs in URL parameters, as they may be logged in server logs or exposed in browser history.

- Avoid storing sensitive information: Do not store sensitive information in the JWT payload, as it is easily accessible to anyone who can read the token.

- Use HTTPS: Ensure that all communication involving JWTs is secured using HTTPS, to prevent tampering and eavesdropping.

## JWT in Express:

To implement JWT in a Node.js Express application, we follow these steps:

- Install the jsonwebtoken library: **npm install jsonwebtoken**
- Require the library in our Express application: const jwt = require('jsonwebtoken');
- Generate a JWT:

```javascript
const payload = {
            login: login,
            name: findUser.name
        }
const secret = process.env.JWT_SECRET;
const options = { expiresIn: '1h' };

const token = jwt.sign(payload, secret, options);
```

- we attach the JWT to the response: 

```javascript
res.json({ message: 'login success', name: findUser.name, token: token })
```

- verify the JWT:

```javascript
try {
        const token = req.headers.authorization;
        if (!token)
            return res.status(401).json({ message: "Auth failed, No token provided" });
        const bearer = token.split(" ");
        if (bearer.length !== 2)
            return res.status(401).json({ message: "Auth failed, Invalid token format" });
        const decoded = jwt.verify(bearer[1], process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Auth failed, Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Auth failed, Invalid token" });
        } else
            return res.status(401).json({
                message: "Auth failed"
            });
    }
```

- Use the JWT:

```javascript
fetch(url + "/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })
```

Now let's apply this on our project 

# Project

before starting to explain the code of our project lets give a small Demo on how the result looks like 

https://user-images.githubusercontent.com/121964432/215355990-326d81df-f3b8-4e51-aaae-21aedaf12ce5.mp4

# Server:

# MongoDB:

MongoDB is a NoSQL, document-oriented database management system. It is used to store and manage large amounts of structured and unstructured data. Unlike traditional relational databases, MongoDB stores data in JSON-like documents, making it easier to work with dynamic data structures. MongoDB is known for its scalability, performance, and ease of use, making it a popular choice for modern web applications and other big data use cases.

## Models: 

### Memos Model:

This code is defining a Mongoose schema for a "memo" document. The schema has two fields: "date" and "content", both of which are required and have a data type of "String".

```javascript
const { default: mongoose } = require("mongoose");

const schema= new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
})
```
The schema is then used to create a Mongoose model named "Memo".
```javascript
const Memo=mongoose.model("memos",schema)
```
Finally, both the "schema" and the "Memo" are exported from this module, so that they can be used in other parts of the application.
```javascript
module.exports={schemaMemo:schema,Memo:Memo}
```

### Users Model:

This code is defining a Mongoose schema for a "user" document. The schema has four fields: "login", "pwd", "name", and "memos". The "login" and "pwd" fields are required and have a data type of "String". The "name" field is also required and has a data type of "String". The "memos" field is an array that uses the "schemaMemo" imported from the "Memo" File.

```javascript
const { default: mongoose } = require("mongoose");
const { schemaMemo } = require("./Memo");

const schema = new mongoose.Schema({
    login: {
        type: String,
        required: true
    },
    pwd: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    memos: [schemaMemo]
})
```
The schema is then used to create a Mongoose model named "User".
```javascript
const User = mongoose.model("users", schema)
```
Finally, the "User" model is exported from this module, so that it can be used in other parts of the application.
```javascript
module.exports.User = User
```

## Routes:
### UserRoute:

We define a set of routes for user authentication and management using Express.

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const router = express.Router();
```

- POST "/register": This route allows new users to register by providing a login, password, and name. The input is verified to ensure that all required fields are filled, passwords match, and the login is unique. If everything is in order, the password is hashed using bcrypt and a new user document is created and saved to the MongoDB database using the User model.

```javascript
router.post('/register', async (req, res) => {
  
    const { login, pwd, pwd2, name } = req.body;
    if (!login || !pwd || !pwd2 || !name)
        return res.status(400).json({ message: 'all fields are required' });
    if (pwd != pwd2)
        return res.status(400).json({ message: 'passwords dont match' });

    let searchUser = await User.findOne({ login: login })
    if (searchUser)
        return res.status(400).json({ message: 'login already exists' });


    const mdpCrypted = await bcrypt.hash(pwd, 10)
    const user = new User({
        login: login,
        name: name,
        pwd: mdpCrypted,
        memos: []
    })
    user.save().then(() => res.status(201).json({ message: 'success' }))
        .catch(err => res.status(500).json({ message: err }))
})
```
- POST "/login": This route allows existing users to log in by providing a login and password. The input is checked against the database to see if the user exists. If the user is found, the provided password is compared to the hashed password stored in the database using bcrypt.compare(). If the passwords match, a JSON Web Token (JWT) is signed with the login and name as the payload and a secret key stored in an environment variable (process.env.JWT_SECRET). The token is returned to the client along with a success message.

```javascript
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const router = express.Router();
```

- POST "/logout": This route simply returns a message indicating that the user has successfully logged out. Note that there is no actual logout functionality in this code.

```javascript
router.post("/logout", (req, res) => {
    res.json({ message: "User logged out successfully" });
});

```

- The routes are exported as UserRouter
```javascript
module.exports.UserRouter = router;
```
- so they can be used in another module by calling:
```javascript
const { UserRouter } = require("./UserRoute");
```

### MemoRoute

Here is the node.js backend for a memo app. It uses the express.js framework for routing and handling HTTP requests, the jsonwebtoken library for authentication, and mongodb models (Memo and User) for storing and accessing data in the database.

- POST "/": to create a new memo and add it to the user's memo list.
```javascript
router.post("/", async (req, res) => {
    const { date, content } = req.body;
    if (!date || !content)
        return res.status(400).json({ message: "date and content are required" });

    const memo = new Memo({
        date: date,
        content: content
    });
    const login = req.userData.login;
    try {
        const dataMemo = await memo.save();
        const user = await User.findOne({ login: login });
        user.memos.push(dataMemo);
        const data = await user.save();
        res.json(dataMemo);
    } catch (err) {
        res.status(500).send({ message: err });
    }
});
```
- GET "/": to retrieve a specified number (or all) of memos for the authenticated user.
```javascript
router.get("/", async (req, res) => {
    const login = req.userData.login;
    const user = await User.findOne({ login: login });
    const nbr = req.query.nbr || user.memos.length;
    const dataToSend = user.memos.filter((elem, index) => index < nbr);
    res.json(dataToSend);
});
```
- PUT "/:id": to update a memo specified by its id for the authenticated user.
```javascript
router.put("/:id", async (req, res) => {
    try {
        const { date, content } = req.body;
        const login = req.userData.login;
        const user = await User.findOne({ login: login });
        const memo = user.memos.id(req.params.id);
        memo.date = date;
        memo.content = content;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});
```
- DELETE "/:id": to delete a memo specified by its id for the authenticated user.
```javascript
router.delete("/:id", async (req, res) => {
    try {
        const login = req.userData.login;
        const user = await User.findOne({ login: login });
        user.memos.id(req.params.id).remove();
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});
```
Before accessing these endpoints, the code checks the authentication of the user using the jsonwebtoken library. If a token is provided in the request header, the code verifies the token and decodes it to obtain user data. If the token is invalid or not provided, the code returns a 401 error.
```javascript
router.use("", (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token)
            return res.status(401).json({ message: "Auth failed, No token provided" });
        const bearer = token.split(" ");
        if (bearer.length !== 2)
            return res.status(401).json({ message: "Auth failed, Invalid token format" });
        const decoded = jwt.verify(bearer[1], process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Auth failed, Token expired" });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Auth failed, Invalid token" });
        } else
            return res.status(401).json({
                message: "Auth failed"
            });
    }
});
```
The code exports a router object to handle these endpoints, which can be used in another file to include these endpoints in the express app.
```javascript
module.exports.memosRouter = router;

```
