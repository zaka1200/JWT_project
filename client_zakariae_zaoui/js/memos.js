import { loading, url } from "./config.js";
import { addMemoToTable } from "./main.js";

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