// canvas color: #caeec2
// Apple color: #FF0000
// Snake color: #14BD37

// Adjunk alapértékeket a változókhoz

const gameOverDiv = document.querySelector('.game-over');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('.score');
const speedEl = document.querySelector('.speed');
const startGameButton = document.querySelector('.start');

// Használd a canvas "getAttributumát, hogy a magasságát és szélességét elmentsd"
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

// Létrehozunk egy "box" változót, beállítjuk 10-re az értékét (ez fogja tárolni
// az alap méretét az almának és a kigyó "egységnyi" testének)
// Deklarálunk egy üres "snake" listát, amiben a testrészei lesznek
// Kell egy "timerId", ami az időzítőt fogja tárolni. Nem kell alapérték neki.
// Deklarálunk egy "apple" elemet, ami indulásként két koordinátát fog tárolni
// (hogy hol legyen az alma induláskor a canvason)

const box = 10;
const snake = [];
let timerId;
const apple = [0, 40];
let score = 0;
const speedList = [
    220, 160, 140, 120, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28,
    26, 24, 22, 20, 18, 16, 14, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0.5, 0.4, 0.3, 0.2, 0.1,
];
let curIndex = 0;
let curSpeed = `${curIndex + 1}00`;

//Irányok kezeléséhez segítségnek megadunk egy 2D listát, amit később fel tudunk használni:
// Ha x tengely mentén jobbra megyünk egy egységnyit ("box"),
// függőlegesen meg nem mozdulunk , akkor a lista első eleme jelenti az aktuális irányt és így tovább

const directions = [
    [box, 0], // right
    [0, box], //down
    [-1 * box, 0], // left
    [0, -1 * box], // up
];

// Kezdésnek kitűzünk egy indulási irányt a "directions listából" (itt még nincs mozgás, csak az irányt kitűzzük)
// Ez az actDirection, mint aktuális irány fogja tárolni, hogy merre haladjon (nőjön a kígyó)
let actDirection = directions[0];

// --------------------------- Print Table -----------------------------------------

// Kezdjünk játszani. Hozzunk létre egy start Game function-t.
// Hozzunk létre egy lokális Objektumot "snakeBody", ami két koordinátát fog tárolni.
// egyik property neve legyen: widthP, (szélességi pozició)
// másik property neve: heightP
// Így adjuk meg, hogy hol helyezkedjen el az induláskor.
// Használjuk egységként a 'box' értéket:
// Pl: let snakeBody = { widthP: box, heightP: 0};
// Adjuk hozzá a snakeListánkhoz, mint induló "testrész";
// Itt fogjuk elindítani az időzítőt is kicsit később
// Még ebben a metódusban hívjunk meg egy "printTable()" függvényt,
// Amit a következőkben fogunk megírni

document.addEventListener('DOMContentLoaded', () => {
    ctx.fillStyle = '#caeec2';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
});
startGameButton.addEventListener('click', startGame);

function startGame() {
    const snakeBody = {
        widthP: box,
        heightP: 0,
    };
    snake.push(snakeBody);
    printTable();
    timerId = setInterval(moveSnake, speedList[curIndex]);
    speedEl.textContent = curSpeed;
}

//Első lépésnek meg kell rajzolni a világos zöld táblát, majd utána rá kell rajzolni
// a piros színű almát (haszáljuk a két induló értéket, koordinátaként,
// majd a box egységet, hogy mekkora méretre fesse fel az almát => fillRect).
// Végül a kigyó sötétzöld testét is meg kell rajzolni.
// Bár most még csak egy testrésze van, mindig ciklussal végig kell menni rajta és "felül"
// festeni a canvast(ctx.fillRect)
function printTable() {
    // Create table
    ctx.fillStyle = '#caeec2';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // Create starting apple
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(apple[0], apple[1], box, box);
    // Create starting snake
    ctx.fillStyle = '#14BD37';
    snake.forEach(bodyPart => ctx.fillRect(bodyPart.widthP, bodyPart.heightP, box, box));
}

// -------------------------- Move snake, move!! -------------------------------

// Kezdjünk el mozogni.
// Hozzunk létre egy moveSnake függvényt, ami mozgatni fogja a kígyót.
// Elsőnek állapítsuk meg, "hol a feje a kígyónak". => a snake lista utolsó eleme lesz.
// Ha majd eszik a kigyó mindig nőni fog a lista a "feje" felé. Mentsük ki egy lokális
// változóba pl: 'headOfSnake'
// Hozzunk létre még egy lokális változót: "newHeadPosition"
// Ki kell számolnunk és ebbe kell belementenünk a két új koordinátát a headOfSnake és
// a korábban létrehozott actDirection megfelelő értékeivel. (két elemű lista)
// Miután kiszámoltuk, megvannak a koordináták, hozzunk létre egy:
// "newBodyPart" Objektumot, hasonlóan mint a startGame-ben, adjuk át a megfelelő position-ket
// a newHeadPosition-ből.
// Már csak hozzá kell adnunk a snake listához az új testrészt. Végül vegyük ki az első elemet
// a "kígyó farok részét". => shift() metódus .
// Így gyakorlatilag eltoljuk egy irányba a kígyót
// Megváltoztak a kigyó testjének koordinátái, újra kell rajzolnunk a táblát.
// Hívjuk meg a függvény végén a már megírt printTable() metódust, hogy az
// újra rajzolja a táblát a kígyó új testrészével együtt
// Még most nem láthatunk változást, hiszen a moveSnake függvényt is meg kell hívni
// De előtte még....

function moveSnake() {
    const headOfSnake = snake[snake.length - 1];
    const newHeadPosition = [headOfSnake.widthP + actDirection[0], headOfSnake.heightP + actDirection[1]];
    const newBodyPart = {
        widthP: newHeadPosition[0],
        heightP: newHeadPosition[1],
    };
    snake.push(newBodyPart);
    snake.shift(snake[0]);
    if (hasCollision()) {
        stopGame();
        showPopup();
        console.error('Game over!');
        return;
    }
    checkEating();
    printTable();
}

function stopGame() {
    clearInterval(timerId);
}

function showPopup() {
    gameOverDiv.style.display = 'flex';
    startGameButton.textContent = 'OK';
    startGameButton.removeEventListener('click', startGame);
    startGameButton.addEventListener('click', () => window.location.reload());
}

// Hozzunk létre egy EventListener-t, ami a billentyűk leütését figyeli és ennek megfelelően
// változtatja az "actDirection" irányát.
// Segítségül egy iránynak megírtuk

// const directions = [
//     [box, 0], // right
//     [0, box], //down
//     [-1 * box, 0], // left
//     [0, -1 * box], // up
// ];

document.addEventListener('keydown', event => {
    event.preventDefault();
    const headOfSnake = snake[snake.length - 1];
    const secondBodyPart = snake[snake.length - 2];
    // if (event.code === 'ArrowDown') actDirection = directions[1];
    if (event.code === 'ArrowDown') {
        if (snake.length === 1 || headOfSnake.heightP + box !== secondBodyPart.heightP)
            actDirection = directions[1];
    }
    // else if (event.code === 'ArrowRight') actDirection = directions[0];
    else if (event.code === 'ArrowRight') {
        if (snake.length === 1 || headOfSnake.widthP + box !== secondBodyPart.widthP)
            actDirection = directions[0];
    }
    // else if (event.code === 'ArrowLeft') actDirection = directions[2];
    else if (event.code === 'ArrowLeft') {
        if (snake.length === 1 || headOfSnake.widthP - box !== secondBodyPart.widthP)
            actDirection = directions[2];
    }
    // else if (event.code === 'ArrowUp') actDirection = directions[3];
    else if (event.code === 'ArrowUp') {
        if (snake.length === 1 || headOfSnake.heightP - box !== secondBodyPart.heightP)
            actDirection = directions[3];
    }
});

// Ha most mindent jól csináltunk, akkor a nyilak leütésének megfelelően mindig változni
// fog az aktuális irány. Ideje élesítenünk a moveSnake() függvényt.
// Nincs már másra szükség, mint a startGame()-ben hozzunk létre egy setIntervalt, mondjuk 200ms-al
// adjuk meg callback function-ként a moveSnake-et:
// timerId = setInterval(moveSnake, 200);
// Mentés után már mozogni kell a pici kígyónknak a billentyűzet segítségével
// Addig ne menj tovább, amíg ezt a működést nem sikerül összehozni

// ---------------------------------------- Az Evés ----------------------------------

// Kezdjük el táplálni a háziállatunkat
// Létrehozzuk az étkezést ellenörző metódusunkat
// Mentsük ki egy lokális változóba a kigyó fejét (utolsó elem a listában)
// Nézzük meg, hogy mindkét koordináta megegyezik e a fej és alma esetén(egy helyen vannak)
// Ha igen, készítsünk egy "newBody" Objektet az alma koordinátáival
// Majd adjuk hozzá a kígyó testéhez, hogy nőni tudjon.
// helyezzük el az almát egy random helyen, vagyis generáljunk random koordinátát neki
function checkEating() {
    const headOfSnake = snake[snake.length - 1];
    if (headOfSnake.widthP === apple[0] && headOfSnake.heightP === apple[1]) {
        const newBody = {
            widthP: apple[0],
            heightP: apple[1],
        };
        snake.unshift(newBody);
        apple[0] = Math.floor((Math.random() * 500) / 10) * 10;
        apple[1] = Math.floor((Math.random() * 400) / 10) * 10;
        changeScoreAndSpeed();
    }
}

function changeScoreAndSpeed() {
    scoreEl.textContent = ++score;
    curIndex++;
    curSpeed = `${curIndex + 1}00`;
    speedEl.textContent = curSpeed;
    clearInterval(timerId);
    timerId = setInterval(moveSnake, speedList[curIndex]);
}

// Még be kell kötnünk a megfelelő helyre a checkEating()-et.
// Hívjuk meg a moveSnake()-ben legfelül. Most odáig kellett eljutnunk, hogy
// mozog a kígyó, nő a teste, ha almára lép, és random helyen jelenik meg az alma
// Nincs sok hátra. Ideje az ütközéseket ellenőrizni

// ----------------------------------- Az Ütközés ---------------------------------

// Ismét a fejét kell megvizsgálnunk.
// Mentsük ki egy változóba a fej objektumát. Nézzük meg, hogy a fej koordinátái
// túlnyúlnak e a canvas méretén (canvasWidth, canvasHeight változó)
// vagy bármelyik testrészének koordinátájával megegyeznek. Akkor térjen vissza true értékkel
// különben false.
// Megj: figyeljünk arra, hogy a fej önmagával történő vizsgálatát elkerüljük
function hasCollision() {
    const headOfSnake = snake[snake.length - 1];
    if (
        headOfSnake.widthP === canvasWidth ||
        headOfSnake.widthP === -10 ||
        headOfSnake.heightP === canvasHeight ||
        headOfSnake.heightP === -10 ||
        snake
        .slice(0, -1)
        .some(bodyPart => bodyPart.widthP === headOfSnake.widthP && bodyPart.heightP === headOfSnake.heightP)
    )
        return true;
}

// Már csak be kell kötnünk. Hívjuk meg legeslegfelül a moveSnake()-ben.
// Ha true értékkel tér vissza vége a játéknak. Töröljük a setInterval-t
// Valami üzenetet jelenítsünk meg a felhasználónak..
// Végére értünk! Gratulálunk, ha eljutottál idáig!
// További fejlesztési lehetőségek: Pontok kiíratása, ahogy nő a kígyó egyre gyorsabban halad

// ----------------------------------- GAME OVER -------------------------------------