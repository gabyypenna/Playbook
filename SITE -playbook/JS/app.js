function formatTime(seconds) {

    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


/* =========================================
   TEMPOS
========================================= */

function getReadingTime() {

    return Number(
        localStorage.getItem("playbookReadingTime") || 0
    );

}


function getGameTime() {

    return Number(
        localStorage.getItem("playbookGameTime") || 0
    );

}


function updateTimeDisplay() {

    const reading = getReadingTime();

    const game = getGameTime();


    const readingElements =
        document.querySelectorAll("#readingTime");


    const gameElements =
        document.querySelectorAll("#gameTime");


    readingElements.forEach(element => {

        element.textContent =
            formatTime(reading);

    });


    gameElements.forEach(element => {

        element.textContent =
            formatTime(game);

    });


    const availableGameTime =
        document.querySelector("#availableGameTime");


    if (availableGameTime) {

        availableGameTime.textContent =
            formatTime(game);

    }

}


/* =========================================
   ADICIONAR TEMPO DE LEITURA
========================================= */

function addReadingTime(seconds) {

    let reading = getReadingTime();

    reading += seconds;


    const game =
        Math.floor(reading / 900) * 600;


    localStorage.setItem(
        "playbookReadingTime",
        reading
    );


    localStorage.setItem(
        "playbookGameTime",
        game
    );


    updateTimeDisplay();

}


/* =========================================
   CAIXA DE ALERTA PERSONALIZADA
========================================= */

function showPlaybookAlert(title, message) {

    /*
        Impede que duas caixas sejam
        abertas ao mesmo tempo.
    */

    const existingModal =
        document.querySelector(".playbook-modal");

    if (existingModal) {
        existingModal.remove();
    }


    /*
        Fundo escuro da caixa
    */

    const modal =
        document.createElement("div");

    modal.className =
        "playbook-modal";


    /*
        Caixa principal
    */

    const box =
        document.createElement("div");

    box.className =
        "playbook-modal-box";


    /*
        Título
    */

    const heading =
        document.createElement("h2");

    heading.textContent =
        title;


    /*
        Mensagem
    */

    const text =
        document.createElement("p");

    text.textContent =
        message;


    /*
        Botão
    */

    const button =
        document.createElement("button");

    button.className =
        "playbook-modal-button";

    button.textContent =
        "Entendi";


    /*
        Fechar caixa
    */

    function closeModal() {

        modal.classList.remove("show");

        setTimeout(() => {

            modal.remove();

        }, 250);

    }


    button.addEventListener(
        "click",
        closeModal
    );


    /*
        Permite fechar apertando ESC
    */

    document.addEventListener(
        "keydown",
        function handleEscape(event) {

            if (event.key === "Escape") {

                closeModal();

                document.removeEventListener(
                    "keydown",
                    handleEscape
                );

            }

        }
    );


    /*
        Montagem da caixa
    */

    box.appendChild(heading);

    box.appendChild(text);

    box.appendChild(button);

    modal.appendChild(box);

    document.body.appendChild(modal);


    /*
        Ativa a animação
    */

    setTimeout(() => {

        modal.classList.add("show");

    }, 10);

}


/* =========================================
   JOGO
========================================= */

function startGame() {

    const gameTime =
        getGameTime();


    if (gameTime <= 0) {

        showPlaybookAlert(
            "Tempo insuficiente",
            "Você ainda não possui tempo de jogo. Continue lendo para conquistar mais tempo."
        );

        return;

    }


    showPlaybookAlert(
        "Jogo iniciado",
        "Você pode utilizar o tempo conquistado através da sua leitura."
    );

}


/* =========================================
   FADE IN
========================================= */

function initFadeIn() {

    const fadeElements =
        document.querySelectorAll(".fade-in");


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


    fadeElements.forEach(element => {

        observer.observe(element);

    });

}


/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateTimeDisplay();

        initFadeIn();

    }
);