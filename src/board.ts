
export type Generator<T>= { next:() => T } 

export type Position = {
    row: number,
    col: number
}

export type Match<T> = {
    matched: T,
    positions: Position[]
}

export type BoardEvent<T> = {
    type: "move",
    kind: "Match",
    first: Position,
    second: Position,
    match: Match<T>
}

export type BoardListener<T> = (event: BoardEvent<T>) => void;

export class Board<T> {
    readonly width: number
    readonly height: number
    private board: T[][]

    constructor(generator: Generator<T>, width: number, height: number) {
        
        this.width = width
        this.height = height
        this.board = []

        for (let i = 0; i < height; i++) {
            const row: T[] = [];
            for (let j = 0; j < width; j++) {
              row.push(generator.next());
            }
            this.board.push(row);
          }
    }

    addListener(listener: BoardListener<T>) {
            
        
    }

    positions(): Position[]{
        const positions: Position[] = [];
        for (let row = 0; row < this.height; row++) {
          for (let col = 0; col < this.width; col++) {
            positions.push({ row, col });
          }
        }
        return positions;
    }

    piece(p: Position): T | undefined {
        if (this.isValidPosition(p)) {
          return this.board[p.row][p.col];
        }
        return undefined;
      }

      private isValidPosition(p: Position): boolean {
        return p.row >= 0 && p.row < this.height && p.col >= 0 && p.col < this.width;
      }


      canMove(first: Position, second: Position): boolean {
        if (!this.isValidPosition(first) || !this.isValidPosition(second)) {
          return false;
        }}
    
     move(first: Position, second: Position) {
    if (this.canMove(first, second)) {
      const temp = this.board[first.row][first.col];
      this.board[first.row][first.col] = this.board[second.row][second.col];
      this.board[second.row][second.col] = temp;

    }
  }
}
