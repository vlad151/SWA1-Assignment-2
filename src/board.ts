export type Generator<T> = { next: () => T };

export type Position = {
  row: number;
  col: number;
};

export type Match<T> = {
  matched: T;
  positions: Position[];
};

export type BoardEvent<T> = { kind: "Match"; match: Match<T> } | { kind: "Refill" };

export type BoardListener<T> = (event: BoardEvent<T>) => void;

export class Board<T> {
  readonly width: number;
  readonly height: number;
  public board: (T | undefined)[][]; // 2D array to represent the board
  private listeners: BoardListener<T>[] = [];
  private generator: Generator<T>;

  constructor(generator: Generator<T>, width: number, height: number) {
    this.generator = generator;
    this.width = width;
    this.height = height;
    this.board = new Array(height)
      .fill(undefined)
      .map(() => new Array(width).fill(undefined));

    // Populate the board using the generator
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        this.board[row][col] = this.generator.next();
      }
    }
  }

  addListener(listener: BoardListener<T>) {
    this.listeners.push(listener);
  }

  positions(): Position[] {
    const positions: Position[] = [];
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        positions.push({ row, col });
      }
    }
    return positions;
  }

  piece(p: Position): T | undefined {
    if (p.row >= 0 && p.row < this.height && p.col >= 0 && p.col < this.width) {
      return this.board[p.row][p.col];
    }
    return undefined;
  }

  canMove(first: Position, second: Position): boolean {
    // Check if both positions are within the boundaries of the board
    if (!this.isValidPosition(first) || !this.isValidPosition(second))
      return false;

    // Check if the tiles are in the same row or column
    const areInSameRowOrColumn =
      first.row === second.row || first.col === second.col;

    if (!areInSameRowOrColumn) return false;

    // Create a deep copy of the board to use as a temporary board
    const tempBoard = this.board.map((row) => row.slice());

    // Swap the tiles on the temporary board
    [tempBoard[first.row][first.col], tempBoard[second.row][second.col]] = [
      tempBoard[second.row][second.col],
      tempBoard[first.row][first.col],
    ];

    // Check for matches at both positions
    const hasMatchAtFirst = this.checkForMatch(first, tempBoard).length > 0;
    const hasMatchAtSecond = this.checkForMatch(second, tempBoard).length > 0;

    return hasMatchAtFirst || hasMatchAtSecond;
  }

  checkForMatch(position: Position, board: (T | undefined)[][]): Position[] {
    const tile = board[position.row][position.col];
    const matchedPositions: Position[] = [];

    if (!tile) return matchedPositions;

    // Horizontal check
    let left = position.col;
    while (left >= 0 && board[position.row][left] === tile) {
      left--;
    }

    let right = position.col;
    while (right < this.width && board[position.row][right] === tile) {
      right++;
    }

    if (right - left - 1 >= 3) {
      for (let i = left + 1; i < right; i++) {
        matchedPositions.push({ row: position.row, col: i });
      }
    }

    // Vertical check
    let up = position.row;
    while (up >= 0 && board[up][position.col] === tile) {
      up--;
    }

    let down = position.row;
    while (down < this.height && board[down][position.col] === tile) {
      down++;
    }

    if (down - up - 1 >= 3) {
      for (let i = up + 1; i < down; i++) {
        matchedPositions.push({ row: i, col: position.col });
      }
    }

    return matchedPositions;
  }

/*   handleMatches() {
    const matches: Match<T>[] = [];

    // 1. Detect matches
    this.positions().forEach((position) => {
      const matchedPositions = this.checkForMatch(position, this.board);
      if (matchedPositions.length) {
        const tile = this.board[position.row][position.col];
        if (tile) {
          matches.push({ matched: tile, positions: matchedPositions });
        }
      }
    });

    // 2. Remove matched tiles and notify listeners
    matches.forEach((match) => {
      match.positions.forEach((position) => {
        this.board[position.row][position.col] = undefined;
      });
      this.listeners.forEach((listener) => listener({ kind: "Match", match }));
    });

    // 3. Drop tiles from above
    for (let col = 0; col < this.width; col++) {
      let emptyRow = this.height - 1;
      for (let row = this.height - 1; row >= 0; row--) {
        if (!this.board[row][col]) {
          continue;
        }
        if (row !== emptyRow) {
          this.board[emptyRow][col] = this.board[row][col];
          this.board[row][col] = undefined;
        }
        emptyRow--;
      }
    }

    // 4. Generate new tiles
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (!this.board[row][col]) {
          this.board[row][col] = this.generator.next();
        }
      }
    }

    if (matches.length > 0) {
        this.listeners.forEach((listener) => listener({ kind: "Refill" }));
    }
  } */

  handleMatches() {
    let foundNewMatches = false;
  
    do {
      const matches: Match<T>[] = [];
  
      // 1. Detect matches
      this.positions().forEach((position) => {
        const matchedPositions = this.checkForMatch(position, this.board);
        if (matchedPositions.length) {
          const tile = this.board[position.row][position.col];
          if (tile) {
            matches.push({ matched: tile, positions: matchedPositions });
          }
        }
      });
  
      // If no matches are found, break out of the loop
      if (matches.length === 0) {
        break;
      }
  
      foundNewMatches = true;
  
      // 2. Remove matched tiles and notify listeners
      matches.forEach((match) => {
        match.positions.forEach((position) => {
          this.board[position.row][position.col] = undefined;
        });
        this.listeners.forEach((listener) => listener({ kind: "Match", match }));
      });
  
      // 3. Drop tiles from above
      for (let col = 0; col < this.width; col++) {
        let emptyRow = this.height - 1;
        for (let row = this.height - 1; row >= 0; row--) {
          if (!this.board[row][col]) {
            continue;
          }
          if (row !== emptyRow) {
            this.board[emptyRow][col] = this.board[row][col];
            this.board[row][col] = undefined;
          }
          emptyRow--;
        }
      }
  
      // 4. Generate new tiles
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          if (!this.board[row][col]) {
            this.board[row][col] = this.generator.next();
          }
        }
      }

    
      this.listeners.forEach((listener) => listener({ kind: "Refill" }));
    



    } while (foundNewMatches);
  
 
  }
  

  private isValidPosition(position: Position): boolean {
    return (
      position.row >= 0 &&
      position.row < this.height &&
      position.col >= 0 &&
      position.col < this.width
    );
  }

  move(first: Position, second: Position) {
    if (!this.canMove(first, second)) return;

    // Swap the tiles
    [this.board[first.row][first.col], this.board[second.row][second.col]] = [
      this.board[second.row][second.col],
      this.board[first.row][first.col],
    ];

    // Check for matches and handle them
    this.handleMatches();
  }

}
