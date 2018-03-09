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
            throw new Error (`Неверно передан аргумент`);
        }
        if (actor === this) {
            return false;
        }
       /*  if (this.left === actor.left || this.right === actor.right || 
            this.top === actor.top || this.bottom === actor.bottom) {
            return false;
            }
        if ((actor.left >= this.left && actor.right <= this.right) && (actor.top >= this.top && actor.bottom <= this.bottom)) {
            return true;
        } 
        else {
            return false;
        } */ 
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
        }else {
            return false;
        }

        
    }
}

function getPlayer(actors) {
    if (typeof actors !== 'undefined') {
        let player = actors.find((el) => (el.type === 'player'));
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
       if(this.height === 0) {
           return undefined;
       }
       let result;  
       /* this.actors.map(function(element) {
            if(actor.isIntersect(element)){
                result = element;
            }
       }); */
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
        
        this['x'] = 'x';
        this['!'] = '!';
        this['@'] = '@';
        this['o'] = 'o';
        this['='] = '=';
        this['|'] = '|';
        this['v'] = 'v';
    }

    actorFromSymbol(symbol) {
        if (this[symbol]) {
            return this[symbol];
        }
        else {
            return undefined;
        }
    }

    obstacleFromSymbol(symbol) {
        let result;
        if (this[symbol]) {
            switch (symbol) {
                case 'x':
                    result = 'wall';
                    break;
                case '!':
                    result = 'lava';
                    break;
                case '=':
                    result = 'horizontal lightning';
                    break;
                case '|':
                    result = 'vertical lightning';
                    break;
                case 'v':
                    result = 'fiery rain';
            }
            return result;
        } else {
            return undefined;
        }
    }

    createGrid() {

    }

    createActors() {

    }
} 