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
