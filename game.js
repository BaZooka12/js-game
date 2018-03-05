class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(vector) {
        try {
            if (vector instanceof Vector === false) {
                throw `Можно прибавлять к вектору только вектор типа Vector`;
            }
            let x = vector.x + this.x;
            let y = vector.y + this.y;
            return new Vector(x, y);
        } catch (error) {
            console.log(`${error}`);
        }
    }

    times(number) {
        try {
            if (typeof number !== 'number') {
                throw `${number} не является числом`;
            }
            let x = this.x * number;
            let y = this.y * number;
            return new Vector(x, y);
        } catch (error) {
            console.log(`${error}`);
      }
    }
}

class Actor {
    constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
        try {
            if (pos instanceof Vector === false || size instanceof Vector === false || speed instanceof Vector === false) {
                throw `Неверно передан аргумент`;
            }

            this.pos = pos;
            this.size = size;
            this.speed = speed;

        } catch (error) {
            console.log(`${error}`);
        }
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
    isIntersect(item) {
        try {
            if (item instanceof Actor === false) {
                throw `Неверно передан аргумент`;
            }
            if (item === this) {
                return false;
            }
            if (this.left === item.left && this.right === item.right && this.top === item.top && this.bottom === item.bottom) {
                return true;
            }
            else {
                return false;
            }

        } catch (error) {
            console.log(`${error}`);
        }
    }
}

function getPlayer(actors) {
    let player = actors.find((el) => el.type === 'player');
    return player;
}

function getWidth(grid) {
    let maxWidth = 0;
    grid.map((el) => {
        if (el.length > maxWidth) {
            maxWidth = el.length;
        }
    });
    return maxWidth;
}

class Level {
    constructor(grid, actors) {
        this.grid = grid;
        this.actors = actors;
        this.player = getPlayer(actors);
        this.height = grid.length;
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
        try {
            if (typeof actor === 'undefined' || actor instanceof Actor === false) {
                throw `Неверно передан аргумент`;
            }

            if (this.isIntersect(actor)) {
                return actor;
            }
            else {
                return undefined;
            }

        } catch (error) {
            console.log(`${error}`);
        }
    }

    obstacleAt(pos, size) {
      try {
        if (pos instanceof Vector === false || size instanceof Vector === false)  {
            throw `Неверно передан аргумент`;
        } 
        
        
      } catch (error) {
        console.log(`${error}`);
      }
    }

    removeActor(element) {
        let position = this.actors.indexOf(element);
        if (position > 0) {
            return this.actors.splice(position, 1);
        }
    }

    noMoreActors(type) {
        return this.actors.find((actor) => actor.type === type ? false : true);
    }

    playerTouched() {
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