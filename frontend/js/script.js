const openDoor = document.getElementById("remove-the-alert");
const closeDoor = document.getElementById("set-the-alert");
const confirm = document.getElementById("confirm-buttom");
let input = document.getElementById('textbox-id');

let password_agreed = false
let bad_password = false

confirm.addEventListener('click', () => {
    if (input.value !== "") {
        sendCommandToServer(input.value)
    }
})

let open_door = false
openDoor.addEventListener('click', () => {
    password_agreed = false
    sendCommandToServer("start_red")
    confirm.disabled = false;
    setTimeout(() => {
        if (password_agreed !== true) {
            sendCommandToServer("buzz")
            alert("time lost")
            confirm.disabled = true
        }
    }, 20000);
    open_door = true
});

let close_door = false
closeDoor.addEventListener('click', () => {
    password_agreed = false
    confirm.disabled = false
    setTimeout(() => {
        if (password_agreed !== true) {
            alert("time lost")
            confirm.disabled = true
        }
    }, 20000);
    close_door = true
});

function sendCommandToServer(command) {
    command = command.toString()
    console.log(command)

    fetch("http://127.0.0.1:5000/home", {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(command)
    }).then(function (response) {
        console.log(response.status)
        if (response.status === 201) {
            password_agreed = true
            if (open_door === true) {
                sendCommandToServer("remove_alarm")
                alert("open door")
                open_door = false
            }
            else if (close_door === true) {
                sendCommandToServer("set_alarm")
                alert("close door")
                close_door = false
            }
            confirm.disabled = true
        } else if (response.status === 202) {
            alert("password is not correct")
            confirm.disabled = true
        }
    })
}

