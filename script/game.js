// 登录逻辑
const loginContainer = document.getElementById('loginContainer');
const gameContainer = document.getElementById('gameContainer');
const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        loginContainer.style.display = 'none';
        gameContainer.style.display = 'block';
    } else {
        alert('请输入账号和密码');
    }
});

// canvas.js
const mapSelect = document.getElementById('mapsize');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let grid_size = 20;
let mapSize = mapSelect.value;
let cell_size = 20;

mapSelect.addEventListener('change', () => {
    mapSize = mapSelect.value;
    canvas.width = mapSize;
    canvas.height = mapSize;
    grid_size = mapSize / cell_size;
});

// color.js
const snake1color = document.getElementById('snake1color');
const snake2color = document.getElementById('snake2color');
const foodcolor = document.getElementById('foodcolor');

let snake1_color = snake1color.value;
let snake2_color = snake2color.value;
let food_color = foodcolor.value;

const updateColor = (element, colorVar) => {
    element.addEventListener('change', () => {
        colorVar = element.value;
        console.log(colorVar);
    });
};

updateColor(snake1color, snake1_color);
updateColor(snake2color, snake2_color);
updateColor(foodcolor, food_color);

// mode.js
const modeSelect = document.getElementById('mode');
let id = parseInt(modeSelect.value);

modeSelect.addEventListener('change', () => {
    id = parseInt(modeSelect.value);
    console.log(id);
});

const speedSelect = document.getElementById('speed');
let speed = parseInt(speedSelect.value);

speedSelect.addEventListener('change', () => {
    speed = parseInt(speedSelect.value);
    console.log(speed);
});

// object.js
function RandomPosition(size) {
    return Math.floor(Math.random() * size);
}

class Snake {
    constructor(color) {
        this.position = [{ x: RandomPosition(grid_size), y: RandomPosition(grid_size) }];
        this.color = color;
        this.dx = 0;
        this.dy = 0;
        this.directionQueue = [];
    }

    draw(ctx, cell_size) {
        this.position.forEach(cell => {
            ctx.fillStyle = this.color;
            ctx.fillRect(cell.x * cell_size, cell.y * cell_size, cell_size, cell_size);
        });
    }
}

class Food {
    constructor(color) {
        this.x = RandomPosition(grid_size);
        this.y = RandomPosition(grid_size);
        this.color = color;
    }

    draw(ctx, cell_size) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x * cell_size, this.y * cell_size, cell_size, cell_size);
    }
}

// move function
function move(snake) {
    if (snake.directionQueue.length > 0) {
        const newDirection = snake.directionQueue.shift();
        snake.dx = newDirection.dx;
        snake.dy = newDirection.dy;
    }
    const head = { x: snake.position[0].x + snake.dx, y: snake.position[0].y + snake.dy };
    console.log('Head:', head);
    snake.position.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        ctx.fillStyle = 'white';
        ctx.fillRect(food.x * cell_size, food.y * cell_size, cell_size, cell_size);
        // 食物被吃掉，生成新的食物
        food = new Food(food_color);
    } else {
        snake.position.pop();
    }
}

// 简化后的 checkCollision 函数
function checkCollision() {
    const checkSelfCollision = (snake) => {
        const head = snake.position[0];
        // 检查是否撞墙
        if (head.x < 0 || head.x >= grid_size || head.y < 0 || head.y >= grid_size) {
            return true;
        }
        // 检查是否撞到自己
        return snake.position.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    };

    const checkSnakeCollision = (snake1, snake2) => {
        const head1 = snake1.position[0];
        const head2 = snake2.position[0];
        // 检查两条蛇的头是否相撞
        if (head1.x === head2.x && head1.y === head2.y) {
            return true;
        }
        // 检查蛇1的头是否撞到蛇2的身体
        return snake2.position.slice(1).some(segment => segment.x === head1.x && segment.y === head1.y);
    };

    if (checkSelfCollision(snake1)) {
        gameOver(1, id);
    } else if (id === 2) {
        if (checkSelfCollision(snake2)) {
            gameOver(2, id);
        } else if (checkSnakeCollision(snake1, snake2) || checkSnakeCollision(snake2, snake1)) {
            gameOver(1, id);
        }
    }
}

// game.js
let snake1 = new Snake(snake1_color);
let snake2 = new Snake(snake2_color);
let food = new Food(food_color);
let interval = null;

const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');

snake1color.addEventListener('input', () => {
    snake1_color = snake1color.value;
    snake1 = new Snake(snake1_color);
});

snake2color.addEventListener('input', () => {
    snake2_color = snake2color.value;
    snake2 = new Snake(snake2_color);
});

foodcolor.addEventListener('input', () => {
    food_color = foodcolor.value;
    food = new Food(food_color);
});

const gameOver = (id, mode) => {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, mapSize, mapSize);
    clearInterval(interval);
    if (mode === 1) {
        alert('Game Over');
    } else if (mode === 2) {
        alert(id === 1 ? 'Player 1 Win' : 'Player 2 Win');
    }
    snake1 = new Snake(snake1_color);
    snake2 = new Snake(snake2_color);
    food = new Food(food_color);
};

startButton.addEventListener('click', () => {
    if (interval !== null) {
        clearInterval(interval);
        console.log('Previous interval cleared');
    }
    ctx.clearRect(0, 0, mapSize, mapSize);
    startButton.disabled = true;

    // 重新获取 id 的值
    id = parseInt(modeSelect.value);
    console.log('Current mode:', id);

    interval = setInterval(() => {
        console.log('Interval running');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, mapSize, mapSize);
        if (id === 1) {
            move(snake1);
        } else if (id === 2) {
            move(snake1);
            move(snake2);
        }
        food.draw(ctx, cell_size);
        snake1.draw(ctx, cell_size);
        if (id === 2) {
            snake2.draw(ctx, cell_size);
        }
        checkCollision();
    }, speed);
    console.log('New interval set with ID:', interval);
});

restartButton.addEventListener('click', () => {
    clearInterval(interval);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, mapSize, mapSize);
    snake1 = new Snake(snake1_color);
    snake2 = new Snake(snake2_color);
    food = new Food(food_color);
    startButton.disabled = false;
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    console.log(key);
    const directionMap = {
        'A': { dx: -1, dy: 0 },
        'a': { dx: -1, dy: 0 },
        'D': { dx: 1, dy: 0 },
        'd': { dx: 1, dy: 0 },
        'W': { dx: 0, dy: -1 },
        'w': { dx: 0, dy: -1 },
        'S': { dx: 0, dy: 1 },
        's': { dx: 0, dy: 1 },
        'ArrowLeft': { dx: -1, dy: 0 },
        'ArrowRight': { dx: 1, dy: 0 },
        'ArrowUp': { dx: 0, dy: -1 },
        'ArrowDown': { dx: 0, dy: 1 }
    };

    if (directionMap[key]) {
        const { dx, dy } = directionMap[key];
        if (key.toLowerCase() === 'a' || key.toLowerCase() === 'd' || key.toLowerCase() === 'w' || key.toLowerCase() === 's') {
            if (snake1.directionQueue.length === 0 || (snake1.directionQueue[snake1.directionQueue.length - 1].dx !== dx && snake1.directionQueue[snake1.directionQueue.length - 1].dy !== dy)) {
                snake1.directionQueue.push({ dx, dy });
                console.log(snake1.directionQueue);
            }
        } else {
            if (snake2.directionQueue.length === 0 || (snake2.directionQueue[snake2.directionQueue.length - 1].dx !== dx && snake2.directionQueue[snake2.directionQueue.length - 1].dy !== dy)) {
                snake2.directionQueue.push({ dx, dy });
            }
        }
    }
});

// audio.js
document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const bgMusicButton = document.getElementById('musicBtn');

    bgMusicButton.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            bgMusicButton.textContent = '🔈';
            console.log('play');
        } else {
            backgroundMusic.pause();
            bgMusicButton.textContent = '🔇';
            console.log('pause');
        }
    });
});