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

## MongoDB
## Models
### Memos Model

### Users Model
