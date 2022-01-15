async function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function distance(x1, y1, x2, y2) {
    return ((x2 - x1)**2 + (y2 - y1)**2)**0.5;
}
function init() {
    let enemiesY = "";
    for (let i = 0; i < Math.floor(Math.random() * 11) + 20; i++) {
        enemiesY += `<circle id="bot${i}" cx="500" cy="${Math.floor(Math.random() * 501)}" r="5" fill="black" />`;
    }
    document.querySelector("#bots").innerHTML = enemiesY;
    let player = document.querySelector("#player");
    player.setAttribute("cx", "500");
    player.setAttribute("cy", "250");
    player.setAttribute("fill", "blue");
    document.querySelector("#output").innerHTML = "";
}
async function moveCircleAnimated(xStart, yStart, xNew, yNew, id, speed=10) {
    let spacingX = (xStart - xNew) / 37;
    let spacingY = (Math.max(yStart, yNew) - Math.min(yStart, yNew)) / 37;
    for (let i=0; i<37; i++) {
        let objBot = document.querySelector(`#${id}`);
        if (id == "player" && i < 36) {
            objBot.setAttribute("fill", "green");
        } else if (id == "player" && i == 36 && distance(xStart, yStart, xNew, yNew) > 30) {
            objBot.setAttribute("fill", "red");
            document.querySelector("#output").innerHTML = "You were shot!";
        } else if (id == "player" && i == 36 && distance(xStart, yStart, xNew, yNew) <= 30){
            objBot.setAttribute("fill", "blue");
            if (xNew <= 100) {
                document.querySelector("#output").innerHTML = "You win!";
            }
        } else if (id != "player" && distance(xStart, yStart, xNew, yNew) > 28) {
            objBot.setAttribute("fill", "red");
        } else if (id != "player" && distance(xStart, yStart, xNew, yNew) <= 28 && xNew <= 100) {
            document.querySelector("#output").innerHTML = "The computer wins!";
        }
        if (xStart > xNew) {
            objBot.setAttribute("cx", xStart - spacingX * i);
        } else {
            objBot.setAttribute("cx", xStart + spacingX * i);
        }
        if (yStart > yNew) {
            objBot.setAttribute("cy", yStart - spacingY * i);
        } else {
            objBot.setAttribute("cy", yStart + spacingY * i);
        }
        await sleep(20);
    }
}
async function rotateHead() {
    let headRotation = 0;
    for (let i = 0; i < 37; i++) {
        let head = document.querySelector("#head");
        head.setAttribute("transform", `rotate(${headRotation})`);
        headRotation += 10;
        await sleep(20);
    }
}
function processGame() {
    if (document.querySelector("#output").innerHTML == "") {
        rotateHead();
        let bots = document.querySelectorAll("#bots > circle");
        for (let bot of bots) {
            if (bot.getAttribute("fill") == "black") {
                let botId = bot.getAttribute("id");
                let botX = Number(bot.getAttribute("cx"));
                let botY = Number(bot.getAttribute("cy"));
                let moveX = -Math.floor(Math.random() * 23 + 7);
                let moveY = Math.floor(Math.random() * 20 - 10);
                let botNewX = botX + moveX;
                let botNewY = botY + moveY;
                if (botNewY >= 500) {
                    botNewY = 500;
                }
                moveCircleAnimated(botX, botY, botNewX, botNewY, botId, 4);
                if (botNewX > 100 && distance(botX, botY, botNewX, botNewY) > 28) {
                    bot.setAttribute("fill", "red");
                }
            }
        }
        let player = document.querySelector("#player");
        let playerX = Number(player.getAttribute("cx"));
        let playerY = Number(player.getAttribute("cy"));
        let clickX = Number(event.clientX - 10);
        let clickY = Number(event.clientY - 83);
        moveCircleAnimated(playerX, playerY, clickX, clickY, "player", 3);

        if (distance(clickX, clickY, playerX, playerY) > 30) {
            player.setAttribute("fill", "red");
            console.log(distance(clickX, clickY, playerX, playerY));
            document.querySelector("#output").innerHTML = "You were shot!";
        } else if (clickX <= 100) {
            document.querySelector("#output").innerHTML = "You Win!";
        } else {
            for (let bot of bots) {
                if (Number(bot.getAttribute("cx")) <= 100) {
                    document.querySelector("#output").innerHTML = "The computer wins!";
                }
            }
        }
    }
}