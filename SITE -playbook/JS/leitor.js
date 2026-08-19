let sessionSeconds = 0;
let savedSessionSeconds = 0;
let isReading = true;


/* =========================================
   FORMATAR TEMPO
========================================= */

function formatTime(seconds) {

    const hours = Math.floor(seconds / 3600);

    const minutes =
        Math.floor((seconds % 3600) / 60);

    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}


/* =========================================
   PEGAR TEMPOS SALVOS
========================================= */

function getReadingTime() {

    return Number(
        localStorage.getItem(
            "playbookReadingTime"
        ) || 0
    );

}


function getGameTime() {

    return Number(
        localStorage.getItem(
            "playbookGameTime"
        ) || 0
    );

}


/* =========================================
   ATUALIZAR CRONÔMETRO
========================================= */

function updateReader() {

    /*
        Se a leitura estiver pausada,
        não adiciona nenhum segundo.
    */

    if (!isReading) {
        return;
    }


    sessionSeconds++;


    /*
        Mostra o tempo da sessão atual.
    */

    const readerTimer =
        document.getElementById(
            "readerTimer"
        );


    if (readerTimer) {

        readerTimer.textContent =
            formatTime(sessionSeconds);

    }


    /*
        Calcula o tempo total de leitura.
    */

    const totalReading =
        getReadingTime() +
        sessionSeconds;


    /*
        Regra do Playbook:

        15 minutos de leitura
        =
        10 minutos de jogo
    */

    const earnedGameTime =
        Math.floor(
            totalReading / 900
        ) * 600;


    const readerGameTime =
        document.getElementById(
            "readerGameTime"
        );


    if (readerGameTime) {

        readerGameTime.textContent =
            formatTime(
                earnedGameTime
            );

    }


    /*
        Salva o progresso
        aproximadamente a cada minuto.
    */

    if (
        sessionSeconds -
        savedSessionSeconds >= 60
    ) {

        saveReadingTime();

    }

}


/* =========================================
   SALVAR TEMPO DE LEITURA
========================================= */

function saveReadingTime() {

    /*
        Descobre quanto tempo novo
        ainda não foi salvo.
    */

    const newSeconds =
        sessionSeconds -
        savedSessionSeconds;


    if (newSeconds <= 0) {
        return;
    }


    const currentReading =
        getReadingTime();


    const totalReading =
        currentReading +
        newSeconds;


    /*
        Calcula o tempo de jogo.
    */

    const gameTime =
        Math.floor(
            totalReading / 900
        ) * 600;


    /*
        Salva os dados.
    */

    localStorage.setItem(
        "playbookReadingTime",
        totalReading
    );


    localStorage.setItem(
        "playbookGameTime",
        gameTime
    );


    /*
        Marca o quanto já foi salvo.

        IMPORTANTE:
        Não zeramos sessionSeconds.
    */

    savedSessionSeconds =
        sessionSeconds;

}


/* =========================================
   CRIAR TELA DE PAUSA
========================================= */

function createPauseScreen() {

    /*
        Verifica se a tela já existe.
    */

    let screen =
        document.querySelector(
            ".reading-pause-screen"
        );


    if (screen) {
        return screen;
    }


    /*
        Cria a tela.
    */

    screen =
        document.createElement("div");


    screen.className =
        "reading-pause-screen";


    /*
        Conteúdo da tela.
    */

    screen.innerHTML = `

        <div class="reading-pause-box">

            <div class="pause-line"></div>

            <p class="pause-label">
                PLAYBOOK
            </p>

            <h2>
                Leitura pausada
            </h2>

            <p>
                Você saiu da página de leitura.
                O tempo não está sendo contabilizado
                enquanto a leitura estiver pausada.
            </p>

            <div class="pause-status">
                LEITURA EM PAUSA
            </div>

            <button
                id="resumeReadingButton"
                class="resume-reading-button">

                Continuar leitura

            </button>

        </div>

    `;


    /*
        Coloca a tela dentro do body.
    */

    document.body.appendChild(
        screen
    );


    /*
        Localiza o botão.
    */

    const button =
        document.getElementById(
            "resumeReadingButton"
        );


    /*
        Quando clicar,
        retoma a leitura.
    */

    if (button) {

        button.addEventListener(
            "click",
            resumeReading
        );

    }


    return screen;

}


/* =========================================
   PAUSAR LEITURA
========================================= */

function pauseReading() {

    /*
        Se já estiver pausado,
        não executa novamente.
    */

    if (!isReading) {
        return;
    }


    /*
        Muda o estado.
    */

    isReading = false;


    /*
        Salva imediatamente
        o tempo lido até o momento.
    */

    saveReadingTime();


    /*
        Cria a tela.
    */

    const screen =
        createPauseScreen();


    /*
        Mostra a tela.
    */

    requestAnimationFrame(() => {

        screen.classList.add(
            "show"
        );

    });

}


/* =========================================
   RETOMAR LEITURA
========================================= */

function resumeReading() {

    /*
        Se já estiver lendo,
        não faz nada.
    */

    if (isReading) {
        return;
    }


    /*
        Localiza a tela.
    */

    const screen =
        document.querySelector(
            ".reading-pause-screen"
        );


    /*
        Esconde a tela.
    */

    if (screen) {

        screen.classList.remove(
            "show"
        );


        /*
            Remove depois da animação.
        */

        setTimeout(() => {

            if (screen.parentNode) {

                screen.remove();

            }

        }, 300);

    }


    /*
        A leitura volta a contar
        somente depois do clique.
    */

    isReading = true;

}


/* =========================================
   DETECTAR TROCA DE ABA
========================================= */

document.addEventListener(
    "visibilitychange",
    function() {

        /*
            Se a aba ficou escondida,
            pausa.
        */

        if (document.hidden) {

            pauseReading();

        }

        /*
            Se a pessoa voltou para a aba,
            NÃO retoma automaticamente.

            Ela precisa clicar no botão.
        */

    }
);


/* =========================================
   CRONÔMETRO
========================================= */

setInterval(
    updateReader,
    1000
);


/* =========================================
   SALVAR ANTES DE SAIR DA PÁGINA
========================================= */

window.addEventListener(
    "beforeunload",
    function() {

        saveReadingTime();

    }
);