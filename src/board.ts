
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
    kind: "Match" | "Refill",
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
//checks if the position is inside the board
      private isValidPosition(p: Position): boolean {
        return p.row >= 0 && p.row < this.height && p.col >= 0 && p.col < this.width;
      }


      canMove(first: Position, second: Position): boolean {
        if (this.isValidPosition(first) && this.isValidPosition(second)) {
          if(first.row !== second.row || first.col !== second.col){
          
           let boardCopy = this.board

            //check if there is a match after the swap
            console.log("has match",this.hasMatch(this.swap(boardCopy, first, second)))


          return this.hasMatch(this.swap(boardCopy, first, second))
              
            

        }}
        return false
      }
      private swap(board:T[][], first: Position, second: Position):T[][] {
        console.log(" before swap",board)
        console.log(first, "first")
        console.log(second, "second")
        //swaps the two positions 
        let tempFirstPosition = board[first.row][first.col];
        board[first.row][first.col] = board[second.row][second.col];
        board[second.row][second.col] = tempFirstPosition;

        console.log("swap",board)
        return board

      }
      private hasMatch(board:T[][]):boolean{
        for(let row = 0; row < this.height; row++){
          for(let col = 0; col < this.width; col++){
            if(board[row][col+1] && board[row][col+2]){
            if(board[row][col] === board[row][col+1] && board[row][col] === board[row][col+2]){
              return true
            }}
            if(board[row+1] && board[row+2]){
            if(board[row][col] === board[row+1][col] && board[row][col] === board[row+2][col]){
              return true
            }}
          }
        }
        return false
      }
    
     move(first: Position, second: Position) {
      if (this.canMove(first, second)) {


    }
  }
}
