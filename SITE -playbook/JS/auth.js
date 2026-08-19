function getUsers() {

    return JSON.parse(
        localStorage.getItem("playbookUsers") || "[]"
    );

}


function saveUsers(users) {

    localStorage.setItem(
        "playbookUsers",
        JSON.stringify(users)
    );

}


/* CADASTRO */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            const users = getUsers();


            const existingUser =
                users.find(
                    user =>
                        user.email === email
                );


            if (existingUser) {

                message.textContent =
                    "Este e-mail já está cadastrado.";

                return;

            }


            users.push({

                name: name,

                email: email,

                password: password,

                readingTime: 0,

                gameTime: 0

            });


            saveUsers(users);


            message.textContent =
                "Conta criada com sucesso.";


            setTimeout(
                () => {

                    window.location.href =
                        "login.html";

                },
                1000
            );

        }
    );

}


/* LOGIN */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            const users = getUsers();


            const user =
                users.find(
                    item =>
                        item.email === email &&
                        item.password === password
                );


            if (!user) {

                message.textContent =
                    "E-mail ou senha incorretos.";

                return;

            }


            localStorage.setItem(
                "playbookLoggedUser",
                JSON.stringify(user)
            );


            localStorage.setItem(
                "playbookReadingTime",
                user.readingTime || 0
            );


            localStorage.setItem(
                "playbookGameTime",
                user.gameTime || 0
            );


            message.textContent =
                "Login realizado com sucesso.";


            setTimeout(
                () => {

                    window.location.href =
                        "index.html";

                },
                800
            );

        }
    );

}