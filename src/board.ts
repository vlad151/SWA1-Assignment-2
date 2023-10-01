export type Generator<T>= { next:() => T } 

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type BoardEvent<T> =any

export type BoardListener<T>=any

export class Board<T> {
    addListener(listener: BoardListener<T>) {
    }

    piece(p: Position): any {
    }

    canMove(first: Position, second: Position): any {
    }
    
    move(first: Position, second: Position) {
    }
}
