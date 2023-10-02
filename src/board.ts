export type Generator<T> = { next: () => T };

export type Position = {
  row: number;
  col: number;
};

export type Match<T> = {
  matched: T;
  positions: Position[];
};

export type BoardEvent<T> =
  | { kind: "Match"; match: Match<T> }
  | { kind: "Refill" };

export type BoardListener<T> = (event: BoardEvent<T>) => void;

export class Board<T> {
  private tiles: T[][];
  private listeners: BoardListener<T>[] = [];

  constructor(tiles: T[][]) {
    this.tiles = tiles;
  }

  addListener(listener: BoardListener<T>) {
    this.listeners.push(listener);
  }

  piece(p: Position): T | undefined {
    return this.tiles[p.row]?.[p.col];
  }

  canMove(first: Position, second: Position): boolean {
    // Check if the positions are adjacent
    const areAdjacent =
      (first.row === second.row && Math.abs(first.col - second.col) === 1) ||
      (first.col === second.col && Math.abs(first.row - second.row) === 1);

    if (!areAdjacent) {
      return false;
    }

    // Temporarily swap the tiles to check for a match
    const temp = this.tiles[first.row][first.col];
    this.tiles[first.row][first.col] = this.tiles[second.row][second.col];
    this.tiles[second.row][second.col] = temp;

    const hasMatch = this.checkForMatch(first) || this.checkForMatch(second);

    // Swap the tiles back to their original positions
    this.tiles[second.row][second.col] = this.tiles[first.row][first.col];
    this.tiles[first.row][first.col] = temp;

    return hasMatch;
  }

  move(first: Position, second: Position): void {
    // Swap the tiles
    const temp = this.tiles[first.row][first.col];
    this.tiles[first.row][first.col] = this.tiles[second.row][second.col];
    this.tiles[second.row][second.col] = temp;

    // Check for matches and handle them
    let matches = this.findAllMatches();
    while (matches.length > 0) {
      for (const match of matches) {
        this.removeMatch(match);
        this.fireEvent({ kind: "Match", match });
      }
      this.refillBoard();
      this.fireEvent({ kind: "Refill" });
      matches = this.findAllMatches();
    }
  }

  private checkForMatch(position: Position): boolean {
    const tile = this.tiles[position.row][position.col];

    // Check horizontally
    let horizontalCount = 1;
    let i = position.col - 1;
    while (i >= 0 && this.tiles[position.row][i] === tile) {
      horizontalCount++;
      i--;
    }
    i = position.col + 1;
    while (
      i < this.tiles[position.row].length &&
      this.tiles[position.row][i] === tile
    ) {
      horizontalCount++;
      i++;
    }

    // Check vertically
    let verticalCount = 1;
    let j = position.row - 1;
    while (j >= 0 && this.tiles[j][position.col] === tile) {
      verticalCount++;
      j--;
    }
    j = position.row + 1;
    while (j < this.tiles.length && this.tiles[j][position.col] === tile) {
      verticalCount++;
      j++;
    }

    // If either count is 3 or more, we have a match
    return horizontalCount >= 3 || verticalCount >= 3;
  }

  private findAllMatches(): Match<T>[] {
    const matches: Match<T>[] = [];

    for (let row = 0; row < this.tiles.length; row++) {
      for (let col = 0; col < this.tiles[row].length; col++) {
        const position: Position = { row, col };
        if (this.checkForMatch(position)) {
          const tile = this.tiles[row][col];
          const matchedPositions: Position[] = []; // Collect all positions of the matched tiles

          // Horizontal matches
          let i = col;
          while (i < this.tiles[row].length && this.tiles[row][i] === tile) {
            matchedPositions.push({ row, col: i });
            i++;
          }

          // Vertical matches
          let j = row;
          while (j < this.tiles.length && this.tiles[j][col] === tile) {
            matchedPositions.push({ row: j, col });
            j++;
          }

          matches.push({ matched: tile, positions: matchedPositions });
        }
      }
    }

    return matches;
  }

  private removeMatch(match: Match<T>): void {
    for (const position of match.positions) {
      this.tiles[position.row][position.col] = undefined;
    }
  }

  private refillBoard(): void {
    for (let col = 0; col < this.tiles[0].length; col++) {
      let emptyRow = this.tiles.length - 1;
      for (let row = this.tiles.length - 1; row >= 0; row--) {
        if (!this.tiles[row][col]) {
          let aboveRow = row - 1;
          while (aboveRow >= 0 && !this.tiles[aboveRow][col]) {
            aboveRow--;
          }
          if (aboveRow >= 0) {
            this.tiles[emptyRow][col] = this.tiles[aboveRow][col];
            this.tiles[aboveRow][col] = undefined;
            emptyRow--;
          }
        }
      }
      while (emptyRow >= 0) {
        const generator = new Generator<T>(); // Assuming you have a Generator class for T
        this.tiles[emptyRow][col] = generator.next();
        emptyRow--;
      }
    }
  }

  private fireEvent(event: BoardEvent<T>): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
