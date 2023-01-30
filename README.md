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

### MemoRoute:

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
Before accessing these endpoints, we check the authentication of the user using the jsonwebtoken library. If a token is provided in the request header, the code verifies the token and decodes it to obtain user data. If the token is invalid or not provided, the code returns a 401 error.
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

## Application:

The role of the app.js file in a Node.js Express project is to create and configure an Express application, which is the main server-side component that provides the API endpoints and handles incoming HTTP requests from clients. The app.js file sets up the Express app, defines the routes and middleware, and starts the server to listen on a specified port. It acts as the entry point for the application and is responsible for configuring and starting the Express app.

- we import several modules (mongoose, express, dotenv, jsonwebtoken, cors) and routes (UserRouter, memosRouter).

```javascript
const mongoose = require('mongoose')
const express = require('express')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { UserRouter } = require('./routes/users');
const { memosRouter } = require('./routes/memos');
dotenv.config();
```

- We connect to a MongoDB Atlas cluster using the URI stored in the process.env.MONGODB_URI environment variable.

```javascript
mongoose.connect
    (process.env.MONGODB_URI)
    .then(() => console.log("connected to mongodb atlas"))
    .catch(err => console.log(err))
```

- We create an Express application, configure it to parse JSON data on incoming requests, and set up CORS to allow all requests.

```javascript
const app = express();
//middleware to parse json data on body request
app.use(express.json())
app.use(cors({
    origin: '*'
}));
```

- We use the imported UserRouter and memosRouter for routing requests to the '/users' and '/memos' endpoints, respectively.

```javascript
app.use('/users', UserRouter)

app.use('/memos', memosRouter)
```

- We create a middleware function that checks for authentication on requests by looking for a JSON Web Token (JWT) in the headers of incoming requests, and verifies the token using a secret key stored in process.env.JWT_SECRET.

```javascript
app.use((req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
});
```

- We create a simple GET route for the root endpoint '/', that sends a simple "hi" message as a response.

```javascript
app.get('/', (req, res) => {
    res.send("hi");
})
```

- We set up the Express app to listen on a port defined in the process.env.port environment variable or 30000 if not provided.

```javascript
const port = process.env.port || 30000
app.listen(port, () => {
    console.log('server listening on port : ', port)
})
```

# Client:

The client-side refers to the front-end or user interface, which is typically built using HTML, CSS, and JavaScript. This is the part of the project that the end-user interacts with and it communicates with the server-side (Express Node.js back-end) to fetch and manipulate data.  The client-side is usually served to the user's browser, where the HTML, CSS, and JavaScript code is executed, to create a dynamic and interactive user interface.

# Config.js:

here we  export variables that represent elements from the html page. The exported constants (e.g. loginBtn, emailLogin, etc.) are assigned to elements on the page with a specific id value, which is retrieved using document.getElementById(). The exported url constant is a string representing a base URL for making API requests. 

```javascript
export const url=" http://localhost:30000"

export const loginBtn = document.getElementById("loginBtn");
export const emailLogin = document.getElementById("emailLogin");
export const passwordLogin = document.getElementById("passwordLogin");
export const welcomeElement = document.getElementById("welcomeElement");
export const applicationElement = document.getElementById("applicationElement");
export const loginElement = document.getElementById("loginElement");
export const registerElement = document.getElementById("registerElement");
export const memoInput = document.getElementById("memoInput");
export const resetBtn = document.getElementById("resetBtn");
export const addBtn = document.getElementById("addBtn");
export const tbody = document.getElementById("tbody");
export const emailRegister = document.getElementById("emailRegister");
export const nameRegister = document.getElementById("nameRegister");
export const passwordRegister = document.getElementById("passwordRegister");
export const passwordRegister2 = document.getElementById("passwordRegister2");
export const registerBtn = document.getElementById("registerBtn");
export const logoutElement = document.getElementById("logoutElement");
export const loading = document.getElementById("loading");
```

# main.js:

Here we manage various components of the website and listens to various events on the page. We import different functions from different files (config.js, auth.js, and memos.js) to perform different tasks.

- There are event listeners for the different buttons in the application. For example, the 'click' event of the loginBtn element calls the authentifier function with the inputted login email and password. The 'click' event of the registerBtn element calls the register function with the inputted email, name, password, and password confirmation.

```javascript
loginBtn.addEventListener('click', async () => {
    const login = emailLogin.value
    const pwd = passwordLogin.value
    if (!login || !pwd)
        return alert("please complete all fileds")

    await authentifier(login, pwd)

})

logoutElement.addEventListener('click', () => {
    logout();
})

resetBtn.addEventListener('click', () => {
    memoInput.value = ""
})

addBtn.addEventListener('click', () => {
    const content = memoInput.value
    if (!content)
        return alert("please provide a content for your memo")

    addMemo(content)
})

registerBtn.addEventListener('click', () => {
    // Recuperation des valeurs
    const email = emailRegister.value
    const name = nameRegister.value
    const pwd = passwordRegister.value
    const pwd2 = passwordRegister2.value

    // verification des valeurs
    if (!email || !name || !pwd || !pwd2)
        return alert("please fill all inputs")

    if (pwd != pwd2)
        return alert("passwords didn't match")


    // appel de la methode register
    register(email, name, pwd, pwd2)

})
```

- There are two functions viderRegister and viderLogin to clear the input fields after a successful authentication or registration.

```javascript
export const viderRegister = () => {
    emailRegister.value = ""
    nameRegister.value = ""
    passwordRegister.value = ""
    passwordRegister2.value = ""
}
export const viderLogin = () => {
    passwordLogin.value = ""
    emailLogin.value = ""
}
```

- The addMemoToTable function is used to add a memo to the memo table. It creates table rows and cells, sets their attributes and text content, and adds them to the table body. The function also adds event listeners to the 'delete' and 'modify' buttons of each memo to perform the corresponding actions.

```javascript
export const addMemoToTable = (memo) => {
    const { date, content, _id } = memo

    const tr = document.createElement("tr")
    const td1 = document.createElement("td")
    const td2 = document.createElement("td")
    const td3 = document.createElement("td")
    const td4 = document.createElement("td")
    const btn = document.createElement("button")
    const btn2 = document.createElement("button")

    tr.appendChild(td1)
    tr.appendChild(td2)
    tr.appendChild(td3)
    tr.appendChild(td4)
    td4.appendChild(btn)
    td4.appendChild(btn2)

    tr.setAttribute("id", _id);
    
    td1.innerText = _id
    td2.innerHTML = content
    td3.innerText = date
    btn.innerText = "delete"
    btn2.innerText = "modify"

    btn.classList.add("delete")
    btn2.classList.add("modify")
    tbody.appendChild(tr)
    btn.addEventListener("click", async () => {
        await deleteMemo(_id)
    })
    btn2.addEventListener("click", async () => {
        const content = memoInput.value
        await modifyMemo(_id,content)
    })


}
```

- The getPath function returns the current URL hash, and the singlePageManger function takes the path as an argument to manage the navigation between pages in the application. It hides all the components, removes the 'selected' class from the navigation links, and then shows the selected component.

```javascript
const getPath = () => window.location.hash || '#welcome'
const singlePageManger = (path) => {
    console.log(path)
    if (path == "#application") {
        tbody.innerText = ""
        load();
    }
    const components = document.getElementsByClassName("component")
    Array.from(components).forEach(element => {
        element.classList.add('hidden');
    })
    const links = document.querySelectorAll('header nav li')
    Array.from(links).forEach(element => {
        element.classList.remove('selected');
    })
    document.querySelector(path).classList.remove('hidden')
    document.querySelector('header nav li:has(a[href="' + path + '"])').classList.add('selected')
}
```

# auth.js:

the role of this part is to provide functionalities related to authentication
 
- Here we export three functions: authentifier, logout, and register. These functions interact with a back-end API to handle authentication and logout functionality. 
 
 - The authentifier function takes in a login and pwd parameter, which are the user's login name and password. It creates a JavaScript object dataToSend containing the login and pwd, and sends a POST request to the API's /users/login endpoint. The request includes the Content-Type header set to application/json and the dataToSend object stringified and sent as the request body.

```javascript
 export const authentifier = (login, pwd) => {
    const dataToSend = { login: login, pwd: pwd }
    fetch(url + "/users/login", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
            'Content-Type': 'application/json'
            // 'Authorization': 'Bearer <$token>'
        }
    }).then(res => {
        if (res.ok) {


            res.json().then(data => {

                const { name, token } = data;
                logoutElement.children[0].innerText = "Logout(" + name + ")"

                // insertion du JWT dans le local storage
                localStorage.setItem("token", token);
                window.location = "#application"
                loginElement.classList.add("hidden")
                logoutElement.classList.remove("hidden")
                viderLogin();
                //S
            }).catch(err => alert(err))
        }
        else {
            alert("echec d'authentification")
        }
    })
        .catch(err => console.log(err));
}
```
> If the API response is successful, it is processed using the .json() method and the name and token values are extracted from the response data. The token is saved in the browser's local storage using the localStorage.setItem() method. The text of the logout button is updated with the user's name, and the login and logout elements are toggled based on the visibility class. The viderLogin function is also called.

- The logout function sends a POST request to the /users/logout endpoint. If the response is successful, the token is removed from local storage using localStorage.removeItem(), and the login and logout elements are toggled based on the visibility class.

```javascript
export const logout = () => {

    fetch(url + "/users/logout", {
        method: "POST"
    }).then(res => {
        if (res.ok) {
            localStorage.removeItem("token");
            logoutElement.children[0].innerText = "Logout"
            logoutElement.classList.add("hidden")
            loginElement.classList.remove("hidden")
            window.location = "#login"

            // suppression du JWT  du local Storage
        }
        else {
            alert("error dans le logout")
        }
    })
        .catch(err => alert(err));
}
```

- The register function takes in four parameters: email, name, pwd, and pwd2, which represent the user's email, name, password, and password confirmation. It creates a JavaScript object dataToSend containing the registration data, and sends a POST request to the API's /users/register endpoint. The request includes the Content-Type header set to application/json and the dataToSend object stringified and sent as the request body.

```javascript
export const register = (email, name, pwd, pwd2) => {

    const dataToSend = {
        login: email,
        name: name,
        pwd: pwd,
        pwd2: pwd2
    }
    fetch(url + "/users/register", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (res.ok) {
            alert("success");
            window.location = "#login"
            viderRegister();
        }
        else {
            res.json()
                .then(data => {
                    const { message } = data;
                    alert(message)
                })
                .catch(err => {
                    alert("erreur");
                    console.log(err);
                })
        }
    })
        .catch(err => {
            alert("erreur");
            console.log(err);
        });

}
```
> If the API response is successful, an alert message indicating success is displayed and the window.location property is set to the #login hash, which likely navigates the user to a login page. The viderRegister function is called. If the response is not successful, the error message from the response data is extracted and displayed as an alert.

# memos.js:

- **load** : retrieves a list of memos from a server by making a GET request to the URL obtained by concatenating "url" with "/memos". It sets the "Authorization" header of the request to a JSON Web Token (JWT) stored in local storage, and it adds the "Content-Type" header with a value of "application/json". The function removes the "hidden" class from the "loading" element and displays an error message if there is a problem with the request. Once the data is received, it calls the "addMemoToTable" function for each memo in the received data. After the data has been processed, the "hidden" class is added back to the "loading" element.

```javascript
export const load = async () => {

    loading.classList.remove("hidden")
    const token = await localStorage.getItem("token");
    //
    fetch(url + "/memos", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    }).then(res => res.json()).then(data => {
        //data => array
        data.forEach(element => {
            addMemoToTable(element)
        });

    })
        .catch(err => {
            alert("error");
            console.log(err)
        }).finally(() => {
            loading.classList.add("hidden")
        })
}
```

- **addMemo** : adds a memo to the server by making a POST request to the URL obtained by concatenating "url" with "/memos". The function constructs an object to send as the body of the request, containing the memo's content and date. It sets the "Authorization" header of the request to the JWT stored in local storage, and it adds the "Content-Type" header with a value of "application/json". If the response from the server is successful (status code 200), the function calls the "addMemoToTable" function with the data received from the server. If the response is not successful, the function displays an error message.

```javascript
export const addMemo = async (content) => {
    const dataToSend = {
        content: content,
        date: new Date()
    }
    const token = await localStorage.getItem("token");

    fetch(url + "/memos", {
        method: "POST",
        body: JSON.stringify(dataToSend),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        if (res.ok) {
            res.json().then(data => {
                addMemoToTable(data)
            })
        }
        else {
            alert("erreur")
        }
    })
        .catch(err => {
            alert("erreur")
            console.log(err)
        })
}
```

- **deleteMemo**: deletes a memo from the server by making a DELETE request to the URL obtained by concatenating "url" with "/memos/id", where "id" is the id of the memo to be deleted. It sets the "Authorization" header of the request to the JWT stored in local storage, and it adds the "Content-Type" header with a value of "application/json". If the response from the server is successful (status code 200), the function removes the HTML element with the corresponding id. If the response is not successful, the function displays an error message.

```javascript
export const deleteMemo = async (id) => {
    const token = await localStorage.getItem("token");

    fetch(url + "/memos/" + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        if (res.ok) {
            document.getElementById(id).remove();
        }
        else
            alert("error")
    })
        .catch(err => {
            alert("erreur")
            console.log(err)
        })
}
```
- **modifyMemo**: modifies a memo on the server by making a PUT request to the URL obtained by concatenating "url" with "/memos/id", where "id" is the id of the memo to be modified. The function constructs an object to send as the body of the request, containing the memo's new content and date. It sets the "Authorization" header of the request to the JWT stored in local storage, and it adds the "Content-Type" header with a value of "application/json". If the response from the server is successful (status code 200), the function updates the content of the corresponding memo in the HTML element. If the response is not successful, the function displays an error message.

```javascript
export const modifyMemo = async (id, content) => {
    const token = await localStorage.getItem("token");
    const dataToSend = {
        content: content,
        date: new Date()
    }
    fetch(url + "/memos/" + id, {
        method: "PUT",
        body: JSON.stringify(dataToSend),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(res => {
        if (res.ok) {
            document.getElementById(id).children[1].innerText=content
        }
        else
            alert("error")
    })
        .catch(err => {
            alert("erreur")
            console.log(err)
        })
}
```
