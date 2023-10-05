export type Generator<T>= { next:() => T } 

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type BoardEvent<T> = any;

export type BoardListener<T> = any;

export class Board<T> {
    readonly width: number
    readonly height: number

    constructor(generator: Generator<T>, width: number, height: number) {
        this.width = width
        this.height = height
    }

    addListener(listener: BoardListener<T>) {
    }

    positions(): any{
    }

    piece(p: Position): any{
    }

    canMove(first: Position, second: Position):any{
    }
    
    move(first: Position, second: Position) {
    }
}
