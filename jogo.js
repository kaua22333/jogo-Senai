// =====================================================
// CONFIGURAÇÃO DO CANVAS
// =====================================================

const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");


// =====================================================
// DINOSSAURO
// =====================================================

const dino = {

    // Posição
    x: 70,
    y: 230,

    // Tamanho
    largura: 35,
    altura: 40,

    // Velocidade vertical
    velocidadeY: 0,

    // Gravidade
    gravidade: 0.8,

    // Força do pulo
    forcaPulo: -14,

    // Verifica se está no chão
    noChao: true
};


// =====================================================
// CACTOS
// =====================================================

// Lista que guarda todos os cactos
const cactos = [];


// =====================================================
// CONFIGURAÇÃO DA VELOCIDADE
// =====================================================

// Velocidade inicial dos cactos
const velocidadeInicial = 5;

// Velocidade atual
let velocidadeCacto = velocidadeInicial;

// Velocidade máxima
const velocidadeMaxima = 8;


// =====================================================
// CONFIGURAÇÃO DA PONTUAÇÃO
// =====================================================

// Pontuação atual
let pontuacao = 0;

// Contador usado para aumentar a pontuação
let contadorPontuacao = 0;

// Próximo momento em que a velocidade aumenta
let proximoAumentoVelocidade = 100;


// =====================================================
// RECORD
// =====================================================

// Recupera o recorde salvo no navegador.
//
// Se ainda não existir um recorde,
// começa com 0.
let recorde = Number(
    localStorage.getItem("recordeDino")
) || 0;


// =====================================================
// CONFIGURAÇÃO DOS CACTOS
// =====================================================

// Tempo até aparecer o próximo cacto
let tempoProximoCacto = 0;


// =====================================================
// ESTADO DO JOGO
// =====================================================

// Indica se o jogo terminou
let gameOver = false;


// =====================================================
// CONTROLE DO TECLADO
// =====================================================

document.addEventListener("keydown", function(evento) {

    // -------------------------------------------------
    // SE O JOGO TERMINOU
    // -------------------------------------------------

    if (gameOver) {

        // Espaço reinicia o jogo
        if (evento.code === "Space") {
            reiniciarJogo();
        }

        return;
    }


    // -------------------------------------------------
    // PULO
    // -------------------------------------------------

    if (
        (evento.code === "Space" || evento.code === "ArrowUp") &&
        dino.noChao
    ) {

        // Dá impulso para cima
        dino.velocidadeY = dino.forcaPulo;

        // O dinossauro está no ar
        dino.noChao = false;
    }

});


// =====================================================
// ATUALIZAR DINOSSAURO
// =====================================================

function atualizarDino() {

    // Aplicar gravidade
    dino.velocidadeY += dino.gravidade;

    // Mover verticalmente
    dino.y += dino.velocidadeY;


    // Verificar se chegou ao chão
    if (dino.y >= 230) {

        // Colocar no chão
        dino.y = 230;

        // Parar movimento vertical
        dino.velocidadeY = 0;

        // Informar que está no chão
        dino.noChao = true;
    }
}


// =====================================================
// ATUALIZAR PONTUAÇÃO
// =====================================================

function atualizarPontuacao() {

    // Aumenta o contador
    contadorPontuacao++;


    // A cada aproximadamente 6 quadros,
    // aumenta 1 ponto
    if (contadorPontuacao >= 6) {

        pontuacao++;

        contadorPontuacao = 0;
    }


    // -------------------------------------------------
    // VERIFICAR NOVO RECORDE
    // -------------------------------------------------

    if (pontuacao > recorde) {

        // Atualiza o recorde
        recorde = pontuacao;

        // Salva o novo recorde no navegador
        localStorage.setItem(
            "recordeDino",
            recorde
        );
    }


    // -------------------------------------------------
    // AUMENTAR VELOCIDADE
    // -------------------------------------------------

    // A cada 100 pontos
    if (pontuacao >= proximoAumentoVelocidade) {

        // Aumenta um pouco a velocidade
        velocidadeCacto += 0.5;


        // Não ultrapassar a velocidade máxima
        if (velocidadeCacto > velocidadeMaxima) {
            velocidadeCacto = velocidadeMaxima;
        }


        // Próximo aumento
        proximoAumentoVelocidade += 100;
    }
}


// =====================================================
// CRIAR CACTO
// =====================================================

function criarCacto() {

    // Altura aleatória entre 20 e 50
    const altura =
        Math.floor(Math.random() * 31) + 20;


    // Largura aleatória entre 15 e 25
    const largura =
        Math.floor(Math.random() * 11) + 15;


    // Criar o cacto
    const cacto = {

        // Começa no lado direito
        x: canvas.width,

        // Base fica no chão
        y: 270 - altura,

        // Tamanho
        largura: largura,
        altura: altura
    };


    // Adicionar à lista
    cactos.push(cacto);
}


// =====================================================
// CONTROLAR SURGIMENTO DOS CACTOS
// =====================================================

function controlarCactos() {

    // Diminuir contador
    tempoProximoCacto--;


    // Quando chegar a zero
    if (tempoProximoCacto <= 0) {

        // Criar novo cacto
        criarCacto();


        // Intervalo aleatório
        tempoProximoCacto =
            Math.floor(Math.random() * 101) + 80;
    }
}


// =====================================================
// ATUALIZAR CACTOS
// =====================================================

function atualizarCactos() {

    // Percorrer a lista de trás para frente
    for (let i = cactos.length - 1; i >= 0; i--) {

        const cacto = cactos[i];


        // Mover para a esquerda
        cacto.x -= velocidadeCacto;


        // Se saiu completamente da tela
        if (cacto.x + cacto.largura < 0) {

            // Remover o cacto
            cactos.splice(i, 1);
        }
    }
}


// =====================================================
// VERIFICAR COLISÃO
// =====================================================

function verificarColisao() {

    // Verificar todos os cactos
    for (const cacto of cactos) {

        // Comparar os retângulos
        if (
            dino.x < cacto.x + cacto.largura &&
            dino.x + dino.largura > cacto.x &&
            dino.y < cacto.y + cacto.altura &&
            dino.y + dino.altura > cacto.y
        ) {

            // Houve uma batida
            gameOver = true;

            // Parar movimento vertical
            dino.velocidadeY = 0;

            return;
        }
    }
}


// =====================================================
// DESENHAR
// =====================================================

function desenhar() {

    // Limpar a tela
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // =================================================
    // LINHA DE CHÃO
    // =================================================

    ctx.beginPath();

    ctx.moveTo(0, 270);
    ctx.lineTo(800, 270);

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.stroke();


    // =================================================
    // DINOSSAURO
    // =================================================

    ctx.fillStyle = "#000";


    // Corpo
    ctx.fillRect(
        dino.x,
        dino.y,
        35,
        40
    );


    // Cabeça
    ctx.fillRect(
        dino.x + 30,
        dino.y - 20,
        30,
        35
    );


    // Pescoço
    ctx.fillRect(
        dino.x + 25,
        dino.y - 10,
        15,
        20
    );


    // Perna esquerda
    ctx.fillRect(
        dino.x + 5,
        dino.y + 35,
        8,
        5
    );


    // Perna direita
    ctx.fillRect(
        dino.x + 25,
        dino.y + 35,
        8,
        5
    );


    // Cauda
    ctx.fillRect(
        dino.x - 15,
        dino.y + 15,
        20,
        8
    );

    ctx.fillRect(
        dino.x - 25,
        dino.y + 20,
        15,
        6
    );


    // Braço
    ctx.fillRect(
        dino.x + 55,
        dino.y + 5,
        15,
        6
    );


    // Olho
    ctx.fillStyle = "#f5f5f5";

    ctx.fillRect(
        dino.x + 50,
        dino.y - 12,
        5,
        5
    );


    // =================================================
    // CACTOS
    // =================================================

    ctx.fillStyle = "green";


    // Desenhar todos os cactos
    for (const cacto of cactos) {

        // Corpo
        ctx.fillRect(
            cacto.x,
            cacto.y,
            cacto.largura,
            cacto.altura
        );


        // Braço esquerdo
        if (cacto.altura > 30) {

            ctx.fillRect(
                cacto.x - 8,
                cacto.y + 10,
                8,
                6
            );
        }


        // Braço direito
        if (cacto.altura > 40) {

            ctx.fillRect(
                cacto.x + cacto.largura,
                cacto.y + 15,
                8,
                6
            );
        }
    }


    // =================================================
    // PONTUAÇÃO E RECORDE
    // =================================================

    ctx.fillStyle = "#000";

    ctx.font = "20px Arial";

    ctx.textAlign = "right";


    // Transformar a pontuação em 5 dígitos
    const pontuacaoTexto =
        String(pontuacao).padStart(5, "0");


    // Transformar o recorde em 5 dígitos
    const recordeTexto =
        String(recorde).padStart(5, "0");


    // Mostrar pontuação
    ctx.fillText(
        pontuacaoTexto,
        680,
        30
    );


    // Mostrar recorde
    ctx.fillText(
        "HI " + recordeTexto,
        780,
        30
    );


    // =================================================
    // GAME OVER
    // =================================================

    if (gameOver) {

        // Texto principal
        ctx.fillStyle = "#000";

        ctx.font = "bold 40px Arial";

        ctx.textAlign = "center";

        ctx.fillText(
            "GAME OVER",
            canvas.width / 2,
            130
        );


        // Mensagem para reiniciar
        ctx.font = "20px Arial";

        ctx.fillText(
            "Aperte espaço para jogar de novo",
            canvas.width / 2,
            170
        );
    }
}


// =====================================================
// REINICIAR JOGO
// =====================================================

function reiniciarJogo() {

    // -------------------------------------------------
    // LIMPAR CACTOS
    // -------------------------------------------------

    cactos.length = 0;


    // -------------------------------------------------
    // RESETAR DINOSSAURO
    // -------------------------------------------------

    dino.x = 70;
    dino.y = 230;

    dino.velocidadeY = 0;

    dino.noChao = true;


    // -------------------------------------------------
    // RESETAR CACTOS
    // -------------------------------------------------

    tempoProximoCacto = 0;


    // -------------------------------------------------
    // RESETAR PONTUAÇÃO
    // -------------------------------------------------

    pontuacao = 0;

    contadorPontuacao = 0;

    proximoAumentoVelocidade = 100;


    // -------------------------------------------------
    // RESETAR VELOCIDADE
    // -------------------------------------------------

    velocidadeCacto = velocidadeInicial;


    // -------------------------------------------------
    // O RECORDE NÃO É RESETADO!
    // Ele continua salvo no localStorage.
    // -------------------------------------------------


    // Voltar ao jogo
    gameOver = false;
}


// =====================================================
// LOOP PRINCIPAL
// =====================================================

function jogo() {

    // Se o jogo estiver rodando
    if (!gameOver) {

        atualizarDino();

        atualizarPontuacao();

        controlarCactos();

        atualizarCactos();

        verificarColisao();
    }


    // Desenhar tudo
    desenhar();


    // Continuar o jogo
    requestAnimationFrame(jogo);
}


// =====================================================
// INICIAR O JOGO
// =====================================================

jogo();