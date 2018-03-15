'use strict';

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(vector) {
        
        if (vector instanceof Vector === false) {
            throw  new Error (`Можно прибавлять к вектору только вектор типа Vector`);
        }
        let x = vector.x + this.x;
        let y = vector.y + this.y;
        return new Vector(x, y);
    }

    times(number) {
        let x = this.x * number;
        let y = this.y * number;
        return new Vector(x, y);
    }
}

class Actor {
    constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
        if (pos instanceof Vector === false || size instanceof Vector === false || speed instanceof Vector === false) {
            throw new Error (`Неверно передан аргумент`);
        }
        this.pos = pos;
        this.size = size;
        this.speed = speed;
    }

    act() {

    }

    get left() {
        return this.pos.x;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get top() {
        return this.pos.y;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }

    get type() {
        return 'actor';
    }

    isIntersect(actor) {
        if (actor instanceof Actor === false) {
            throw new Error(`Неверно передан аргумент`);
        }
        if (actor === this) {
            return false;
        }
        if (this.left === actor.left || this.right === actor.right ||
            this.top === actor.top || this.bottom === actor.bottom) {
            return false;
        }
        if ((actor.left >= this.left && actor.right <= this.right && actor.top >= this.top && actor.bottom <= this.bottom) ||
            (actor.right > this.left && actor.right < this.right && actor.top > this.top && actor.bottom < this.bottom) ||
            (actor.right > this.left && actor.right < this.right && actor.top < this.bottom && actor.top > this.top) ||
            (actor.right > this.left && actor.right < this.right && actor.bottom > this.top && actor.bottom < this.bottom) ||
            (actor.left > this.left && actor.right < this.right && actor.bottom > this.top && actor.bottom < this.bottom) ||
            (actor.left > this.left && actor.left < this.right && actor.bottom > this.top && actor.bottom < this.bottom) ||
            (actor.left > this.left && actor.left < this.right && actor.top > this.top && actor.bottom < this.bottom) ||
            (actor.left > this.left && actor.left < this.right && actor.top > this.top && actor.top < this.bottom) ||
            (actor.left > this.left && actor.right < this.right && actor.top > this.top && actor.top < this.bottom)) {
            return true;
        } else {
            return false;
        }
    }

}

function getPlayer(actors) {
    if (typeof actors !== 'undefined') {
        let player = actors.find((actor) => (actor.type === 'player'));
        return player;
    }
}

function getWidth(grid) {
    let maxWidth = 0;
    if (typeof grid === 'undefined') {
        return maxWidth;
    } else {
        grid.map((el) => {
            if (el.length > maxWidth) {
                maxWidth = el.length;
            }
        });
    }
    return maxWidth;
}

function getHeight(grid) {
    if (typeof grid === 'undefined') {
        return 0;
    } else {
        return grid.length;
    }
}

class Level {
    constructor(grid, actors) {
        this.grid = grid;
        this.actors = actors;
        this.player = getPlayer(actors);
        this.height = getHeight(grid);
        this.width = getWidth(grid);
        this.status = null;
        this.finishDelay = 1;
    }

    isFinished() {
        if (this.status !== null && this.finishDelay < 0) {
            return true;
        } else {
            return false;
        }
    }

     actorAt(actor) {
       if(actor instanceof Actor === false || typeof actor === 'undefined') {
           throw new Error(`Неверно передан аргумент`);
       }
        let result;
        for (let i = 0; i < this.actors.length; i++) {
        if (actor.isIntersect(this.actors[i])) {
            result = this.actors[i];
            break;
            }
        }
        return result; 
    }

    obstacleAt(pos, size) {
      
        if (pos instanceof Vector === false || size instanceof Vector === false)  {
            throw new Error (`Неверно передан аргумент`);
        } 
        if(pos.y + size.y >= this.height) {
            return 'lava';
        } else if (pos.x < 0 || (pos.x + size.x >= this.width) || pos.y < 0) {
            return 'wall';
        }  
        let top = Math.floor(pos.y);
        let bottom = Math.ceil(pos.y + size.y);
        let left = Math.floor(pos.x);
        let right = Math.ceil(pos.x + size.x);

        for (let i = top; i < bottom; i++) {
            for (let j = left; j < right; j++) {
                let row = this.grid[i];
                if (row) {
                    let obstacle = row[j];
                    if (obstacle) {
                        return obstacle;
                    }
                }
            }
        }

        return undefined;
     
    }

    removeActor(element) {
        let position = this.actors.indexOf(element);
        if (position !== -1) {
            return this.actors.splice(position, 1);
        }
    }

    noMoreActors(type) {
        let result = true;
        if (typeof this.actors === 'undefined' ) {
            return result;
        }
        this.actors.map(function (actor) {
            if (actor.type === type) {
                result = false;
            }
        }); 
        return result;
    }

    playerTouched(type, actor) {
        if (type === 'lava' || type === 'fireball') {
            this.status = 'lost';
        }
        if (type === 'coin') {
            this.removeActor(actor);

            if (this.noMoreActors(type)) {
                this.status = 'won';
            }
        }
    }
}


class LevelParser {
    constructor(dictionary) {
        if (dictionary) { 
            this.dictionary = dictionary;
        }
        this['x'] = 'wall';
        this['!'] = 'lava';
        this['@'] = 'Player';
        this['o'] = 'Coin';
        this['='] = 'HorizontalFireball';
        this['|'] = 'VerticalFireball';
        this['v'] = 'Fireball';
    }

    actorFromSymbol(symbol) {
        if (!symbol) {
            return undefined;
        }
        return this.dictionary[symbol];
    }

    obstacleFromSymbol(symbol) {
        return this[symbol];
    }

    createGrid(field) {
        return field.map((item) => {
            return item.split('').map((element) => {
                let value = this.obstacleFromSymbol(element);
                if(value === 'wall' || value === 'lava') {
                    return value;
                } else {
                    return undefined;
                }
            });
        });
    }

    createActors(field) {
        let result = [];
        if (field.length === 0 || this.dictionary === undefined) {
            return [];
        } else {
            field.forEach((row, i) => {
                row.split('').forEach((symbol, j) => {
                    let value = this.actorFromSymbol(symbol)
                    if (Actor === value || Actor.isPrototypeOf(value)) {
                        result.push(new value(new Vector(j, i)));
                    }
                })
            })
        }
        return result;
    }

    parse(data) {
        return new Level(this.createGrid(data), this.createActors(data));
    }
} 

class Fireball extends Actor {
    constructor(pos = new Vector(0, 0), speed = new Vector(0, 0)) {
        super();
        this.pos = pos;
        this.speed = speed;
    }

    get type() {
        return 'fireball';
    }

    getNextPosition(number = 1) {
        return this.pos.plus(this.speed.times(number));
    }
    
    handleObstacle() {
        this.speed = this.speed.times(-1);
    }

    act(time, level) {
        let nextPosition = this.getNextPosition(time);
        let isIntersect = level.obstacleAt(nextPosition, this.size);
        if (!isIntersect) {
            this.pos = nextPosition;
        } else {
            this.handleObstacle();
        }
    }
}

class HorizontalFireball extends Fireball {
    constructor(pos) {
        super(pos);
        this.size = new Vector(1, 1);
        this.speed = new Vector(2, 0);
    }
}

class VerticalFireball extends Fireball {
    constructor(pos) {
        super(pos);
        this.size = new Vector(1, 1);
        this.speed = new Vector(0, 2);
    }
}

class FireRain extends Fireball {
    constructor(pos) {
        super(pos);
        this.newPos = pos;
        this.size = new Vector(1, 1);
        this.speed = new Vector(0, 3);
    }
    handleObstacle() {
        this.pos = this.newPos;
    }
}

class Coin extends Actor {
    constructor(pos) {
        super(pos);
        this.pos = this.pos.plus(new Vector(0.2, 0.1));
        this.newPos = this.pos;
        this.size = new Vector(0.6, 0.6);
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.spring = Math.random() * 2 * Math.PI;
    }

    get type() {
        return 'coin';
    }

    updateSpring(number = 1) {
        this.spring = this.spring + this.springSpeed * number;
    }

    getSpringVector() {
        return new Vector(0, Math.sin(this.spring) * this.springDist);
    }

    getNextPosition(number = 1) {
        this.updateSpring(number);
        let newPosition = new Vector(this.newPos.x, this.newPos.y);
        return newPosition.plus(this.getSpringVector());
    }

    act(number) {
        this.pos = this.getNextPosition(number);
    }
}

class Player extends Actor{
    constructor(pos) {
        super(pos);
        this.pos = this.pos.plus(new Vector(0, -0.5));
        this.size = new Vector(0.8, 1.5);
        this.speed = new Vector(0, 0);
    }

    get type() {
        return 'player';
    }
}


const schema = [
    "     v                 ",
    "                       ",
    "                       ",
    "                       ",
    "                       ",
    "  |xxx       w         ",
    "  o                 o  ",
    "  x               = x  ",
    "  x          o o    x  ",
    "  x  @    *  xxxxx  x  ",
    "  xxxxx             x  ",
    "      x!!!!!!!!!!!!!x  ",
    "      xxxxxxxxxxxxxxx  ",
    "                       "
];


const actorDict = {
    '@': Player,
    'o': Coin,
    '=': HorizontalFireball,
    '|': VerticalFireball,
    'v': Fireball
}
const parser = new LevelParser(actorDict);
const level = parser.parse(schema);
runLevel(level, DOMDisplay)
    .then(status => console.log(`Игрок ${status}`));
