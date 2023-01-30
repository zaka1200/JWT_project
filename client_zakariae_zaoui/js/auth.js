import { loginElement, logoutElement, url } from "./config.js"
import { viderLogin, viderRegister } from "./main.js";

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