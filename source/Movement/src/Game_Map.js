CycloneMovement.patchClass(Game_Map, $super => class {
  isValid(x, y) {
    return x >= 0 && y >= 0 && Math.floor(x) < this.width() && Math.floor(y) < this.height();
  }

  setup(mapId) {
    $super.setup.call(this, mapId);
    this._loaded = true;
    CycloneMovement.setupCollision();
  }

  isTileClear(x, y) {
    if (!this.checkPassage(x, y, 2)) {
      return false;
    }

    if (!this.checkPassage(x, y, 4)) {
      return false;
    }

    if (!this.checkPassage(x, y, 6)) {
      return false;
    }

    if (!this.checkPassage(x, y, 8)) {
      return false;
    }

    return true;
  }

  distance(x1, y1, x2, y2) {
    if (!CycloneMovement.diagonalPathfinding) {
      return $super.distance.call(this, x1, y1, x2, y2);
    }

    const d1 = Math.abs(this.deltaX(x1, x2));
    const d2 = Math.abs(this.deltaY(y1, y2));

    const total = d1 * d1 + d2 * d2;
    return Math.sqrt(total);
  }
});
