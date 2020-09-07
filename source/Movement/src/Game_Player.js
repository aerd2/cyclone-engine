import './CharacterOverride';

let tryToLeaveVehicleDelay = 0;

CycloneMovement.patchClass(Game_Player, $super => class {
  get defaultWidth() {
    return 0.75;
  }
  get defaultHeight() {
    return 0.375;
  }
  get defaultHitboxX() {
    return 0.125;
  }
  get defaultHitboxY() {
    return 0.5;
  }

  get width() {
    if (this.isInVehicle()) {
      return 1;
    }

    return this.defaultWidth;
  }
  get height() {
    if (this.isInVehicle()) {
      return 1;
    }

    return this.defaultHeight;
  }

  get hitboxX() {
    if (this.isInVehicle()) {
      return 0;
    }

    return this.defaultHitboxX;
  }

  get hitboxY() {
    if (this.isInVehicle()) {
      return 0;
    }

    return this.defaultHitboxY;
  }

  // eslint-disable-next-line complexity
  moveByInput() {
    if (this.isMoving() || !this.canMove()) {
      return;
    }

    let direction = Input.dir4;
    let diagonalDirection = Input.dir8;
    let alternativeD = direction;

    if (direction > 0) {
      $gameTemp.clearDestination();
    // } else if ($gameTemp.isDestinationValid()) {
      // direction = this.determineDirectionToDestination();
      // diagonalDirection = direction;
    }

    alternativeD = this.getAlternativeDirection(direction, diagonalDirection);

    // this.clearCheckedTiles();

    if (direction === 0) {
      return;
    }

    if (this.canPass(this._x, this._y, direction) || (direction !== alternativeD && this.canPass(this._x, this._y, alternativeD))) {
      this.onBeforeMove();

      const oldDirection = this._direction;
      this.executeMove(diagonalDirection);
      if (this.isMovementSucceeded()) {
        return;
      }

      this.executeMove(direction);
      if (!this.isMovementSucceeded()) {
        this.executeMove(alternativeD);

        // If none of the directions was clear and we were already facing one of them before, then revert back to it
        if (!this.isMovementSucceeded()) {
          if (oldDirection === direction || oldDirection === alternativeD) {
            this._direction = oldDirection;
          }
        }
      }

      return;
    }

    if (this.tryOtherMovementOptions(direction)) {
      return;
    }

    if (this._direction !== direction) {
      this.setDirection(direction);
      this.checkEventTriggerTouchFront();
    }
  }

  onBeforeMove() {
    tryToLeaveVehicleDelay = 20;
  }

  tryOtherMovementOptions(direction) {
    if (this.tryToLeaveVehicle(direction)) {
      return true;
    }

    if (this.tryToAvoidDiagonally(direction)) {
      return true;
    }

    if (this.tryToAvoid(direction, 0.75)) {
      return true;
    }

    return false;
  }

  tryToLeaveVehicle(direction) {
    if (!CycloneMovement.autoLeaveVehicles) {
      return false;
    }

    if (tryToLeaveVehicleDelay > 0) {
      tryToLeaveVehicleDelay--;
      return false;
    }

    if (!this.isInBoat() && !this.isInShip()) {
      return false;
    }

    return this.getOffVehicle(direction);
  }

  tryToAvoid(direction, maxOffset) {
    if (direction === 4 || direction === 6) {
      if (this.tryToAvoidVertically(direction, maxOffset)) {
        return true;
      }
    }

    if (direction === 2 || direction === 8) {
      if (this.tryToAvoidHorizontally(direction, maxOffset)) {
        return true;
      }
    }

    return false;

  }

  tryToAvoidDirection(xOffset, yOffset, movementDirection, faceDirection) {
    if (this.canPass(this._x + xOffset, this._y + yOffset, faceDirection)) {
      this.executeMove(movementDirection);
      this.setDirection(faceDirection);
      return true;
    }

    return false;
  }

  tryToAvoidDiagonally(direction) {
    if (direction === 4 || direction === 6) {
      if (this.canPassDiagonally(this._x, this._y, direction, 2)) {
        this.executeMove(direction - 3);
        return true;
      }

      if (this.canPassDiagonally(this._x, this._y, direction, 8)) {
        this.executeMove(direction + 3);
        return true;
      }

      return false;
    }

    if (direction === 2 || direction === 8) {
      if (this.canPassDiagonally(this._x, this._y, 4, direction)) {
        this.executeMove(direction - 1);
        return true;
      }

      if (this.canPassDiagonally(this._x, this._y, 6, direction)) {
        this.executeMove(direction + 1);
        return true;
      }

      return false;
    }

    return false;
  }

  tryToAvoidVertically(direction, maxOffset) {
    let previousOffset = 0;
    let offset = CycloneMovement.stepSize;

    let downEnabled = true;
    let upEnabled = true;

    while (offset <= maxOffset) {
      if (downEnabled) {
        if (!this.canPass(this._x, this._y + previousOffset, 2)) {
          downEnabled = false;
        }
      }

      if (upEnabled) {
        if (!this.canPass(this._x, this._y - previousOffset, 8)) {
          upEnabled = false;
        }
      }

      if (downEnabled && this.tryToAvoidDirection(0, offset, 2, direction)) {
        return true;
      }

      if (upEnabled && this.tryToAvoidDirection(0, -offset, 8, direction)) {
        return true;
      }

      previousOffset = offset;
      offset += CycloneMovement.stepSize;
    }
  }

  tryToAvoidHorizontally(direction, maxOffset) {
    let previousOffset = 0;
    let offset = CycloneMovement.stepSize;
    let leftEnabled = true;
    let rightEnabled = true;

    while (offset <= maxOffset) {
      if (leftEnabled) {
        if (!this.canPass(this._x - previousOffset, 4)) {
          leftEnabled = false;
        }
      }

      if (rightEnabled) {
        if (!this.canPass(this._x + previousOffset, 6)) {
          rightEnabled = false;
        }
      }

      if (rightEnabled && this.tryToAvoidDirection(offset, 0, 6, direction)) {
        return true;
      }

      if (leftEnabled && this.tryToAvoidDirection(-offset, 0, 4, direction)) {
        return true;
      }

      previousOffset = offset;
      offset += CycloneMovement.stepSize;
    }

    return false;
  }

  executeMove(direction) {
    switch (direction) {
      case 8:
      case 2:
      case 4:
      case 6:
        this.moveStraight(direction);
        break;

      case 7:
        this.moveDiagonally(4, 8);
        break;
      case 9:
        this.moveDiagonally(6, 8);
        break;
      case 1:
        this.moveDiagonally(4, 2);
        break;
      case 3:
        this.moveDiagonally(6, 2);
        break;

      default:
        break;
    }
  }

  getAlternativeDirection(direction, diagonalDirection) {
    if (direction === diagonalDirection) {
      return direction;
    }

    switch (diagonalDirection) {
      case 7:
        return direction == 8 ? 4 : 8;
      case 9:
        return direction == 8 ? 6 : 8;
      case 1:
        return direction == 2 ? 4 : 2;
      case 3:
        return direction == 2 ? 6 : 2;
      default:
        break;
    }

    return direction;
  }

  moveStraight(d) {
    if (this.isMovementSucceeded()) {
      this._followers.updateMove();
    }

    this._moveStraight(d);
  }

  moveDiagonally(horz, vert) {
    if (this.isMovementSucceeded()) {
      this._followers.updateMove();
    }

    this._moveDiagonally(horz, vert);
  }

  checkEventTriggerThere(triggers) {
    if (!this.canStartLocalEvents()) {
      return;
    }

    const direction = this.direction();
    const x1 = this.left;
    const y1 = this.top;

    const x2 = CycloneMovement.roundXWithDirection(x1, direction);
    const y2 = CycloneMovement.roundYWithDirection(y1, direction);

    this.startMapEvent(x2, y2, triggers, true);

    if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
      const x3 = $gameMap.roundXWithDirection(x2, direction);
      const y3 = $gameMap.roundYWithDirection(y2, direction);

      this.startMapEvent(x3, y3, triggers, true);
    }
  }

  shouldTriggerEvent(event, triggers, normal) {
    if (!event) {
      return false;
    }

    if (!event.isTriggerIn(triggers)) {
      return false;
    }

    if (event.isNormalPriority() !== normal) {
      return false;
    }

    if (!event.hasAnythingToRun()) {
      return false;
    }

    return true;
  }

  startMapTileEvent(tileX, tileY, triggers, normal) {
    if (!CycloneMovement.triggerAllEvents && $gameMap.isEventRunning()) {
      return;
    }

    if (!CycloneMovement.blockRepeatedTouchEvents) {
      return $super.startMapEvent.call(this, tileX, tileY, triggers, normal);
    }

    if (CycloneMovement.isTileChecked(tileX, tileY)) {
      return;
    }

    let anyStarted = false;

    for (const event of $gameMap.eventsXy(tileX, tileY)) {
      if (!this.shouldTriggerEvent(event, triggers, normal)) {
        continue;
      }

      CycloneMovement.markEventAsChecked(event);

      event.start();
      anyStarted = true;

      if (!CycloneMovement.triggerAllEvents) {
        return true;
      }
    }

    return anyStarted;
  }

  startMapEvent(x, y, triggers, normal) {
    if ($gameMap.isEventRunning()) {
      return;
    }

    const left = x;
    const right = x + this.width;
    const top = y;
    const bottom = y + this.height;

    const firstX = Math.floor(left);
    const lastX = CycloneMovement.isRoundNumber(right) ? right - 1 : Math.floor(right);
    const firstY = Math.floor(top);
    const lastY = CycloneMovement.isRoundNumber(bottom) ? bottom -1 : Math.floor(bottom);

    for (let newX = firstX; newX <= lastX; newX++) {
      for (let newY = firstY; newY <= lastY; newY++) {
        if (this.startMapTileEvent(newX, newY, triggers, normal) === true) {
          return true;
        }
      }
    }

    return false;
  }

  updateNonmoving(wasMoving, sceneActive) {
    $super.updateNonmoving.call(this, wasMoving, sceneActive);

    if (wasMoving || Input.dir4 !== 0) {
      if (!$gameMap.isEventRunning()) {
        this.checkEventTriggerThere([1, 2]);
        $gameMap.setupStartingEvent();
      }
    }
  }

  _isSamePos(x1, y1, destX, destY) {
    if (Math.floor(x1) !== destX && Math.ceil(x1) !== destX) {
      return false;
    }

    if (Math.floor(y1) !== destY && Math.ceil(y1) !== destY) {
      return false;
    }

    return true;
  }

  triggerTouchAction() {
    if (!$gameTemp.isDestinationValid()) {
      return false;
    }

    const direction = this.direction();
    const x1 = this.x;
    const y1 = this.y;
    const destX = $gameTemp.destinationX();
    const destY = $gameTemp.destinationY();

    if (this._isSamePos(x1, y1, destX, destY)) {
      return this.triggerTouchActionD1(x1, y1);
    }

    const x2 = CycloneMovement.roundXWithDirection(x1, direction);
    const y2 = CycloneMovement.roundYWithDirection(y1, direction);

    if (this._isSamePos(x2, y2, destX, destY)) {
      return this.triggerTouchActionD2(x2, y2);
    }

    const x3 = CycloneMovement.roundXWithDirection(x2, direction);
    const y3 = CycloneMovement.roundYWithDirection(y2, direction);

    if (this._isSamePos(x3, y3, destX, destY)) {
      return this.triggerTouchActionD3(x3, y3);
    }

    return false;
  }

  isTouchingAirship() {
    const airship = $gameMap.airship();
    if (!airship) {
      return false;
    }

    return this.isTouchingCharacter(airship);
  }

  isFacingVehicle(vehicle) {
    if (!vehicle) {
      return false;
    }

    let { x, y } = this;
    switch (this._direction) {
      case 2:
        y++;
        break;
      case 4:
        x--;
        break;
      case 6:
        x++;
        break;
      case 8:
        y--;
        break;
    }

    return this.wouldTouchCharacterAt(vehicle, x, y);
  }

  getOnVehicle() {
    if (this.isTouchingAirship()) {
      this._vehicleType = 'airship';
    } else if (this.isFacingVehicle($gameMap.ship())) {
      this._vehicleType = 'ship';
    } else if (this.isFacingVehicle($gameMap.boat())) {
      this._vehicleType = 'boat';
    }

    if (this.isInVehicle()) {
      this._vehicleGettingOn = true;

      if (!this.isInAirship()) {
        const vehicle = this.vehicle();
        if (vehicle) {
          this._x = vehicle._x;
          this._y = vehicle._y;

          this.updateAnimationCount();
        }
      }

      this.gatherFollowers();
    }
    return this._vehicleGettingOn;
  }

  checkDistanceToLand(direction, targetX, targetY) {
    switch (direction) {
      case 2:
        if (Math.abs(targetY - this.bottom) > 0.5) {
          return false;
        }
        break;
      case 4:
        if (Math.abs(targetX - this.left) > 1) {
          return false;
        }
        break;
      case 6:
        if (Math.abs(targetX - this.right) > 0.5) {
          return false;
        }
        break;
      case 8:
        if (Math.abs(targetY - this.top) > 1) {
          return false;
        }
        break;
    }

    return true;
  }

  getBestLandingPosition(vehicle, direction) {
    let x;
    let y;

    switch(direction) {
      case 2:
        x = this.x;
        y = this.y + this.defaultHitboxY + this.defaultHeight;
        break;
      case 4:
        x = this.x - this.defaultHitboxX - this.defaultWidth;
        y = this.y;
        break;
      case 6:
        x = this.x + this.defaultHitboxX + this.defaultWidth;
        y = this.y;
        break;
      case 8:
        x = this.x;
        y = this.y - this.defaultHitboxY - this.defaultHeight;
        break;
    }

    if (!this.canLandOn(x, y)) {
      return false;
    }

    if (this.isCollidedWithCharacters(x, y)) {
      return false;
    }

    if (!vehicle.isLandOk(x, y, direction)) {
      return false;
    }

    return {
      x,
      y,
    };
  }

  getOffVehicle(direction = undefined) {
    direction = direction || this.direction();
    const vehicle = this.vehicle();
    if (!vehicle) {
      return this._vehicleGettingOff;
    }

    const target = this.getBestLandingPosition(vehicle, direction);
    if (!target) {
      return this._vehicleGettingOff;
    }

    if (this.isInAirship()) {
      this.setDirection(2);
    }

    this._followers.synchronize(this.x, this.y, direction);
    this.vehicle().getOff();

    if (!this.isInAirship()) {
      this._x = target.x;
      this._y = target.y;

      this._positionHistory = [];

      this.updateAnimationCount();
      this.setTransparent(false);
    }

    this._vehicleGettingOff = true;
    this.setMoveSpeed(4);
    this.setThrough(false);
    this.makeEncounterCount();
    this.gatherFollowers();
  }

  isPositionPassable(x, y, d) {
    const vehicle = this.vehicle();
    if (vehicle) {
      return vehicle.checkPassage(Math.floor(x), Math.floor(y));
    }

    return $super.isPositionPassable.call(this, x, y, d);
  }

  shouldSkipExtraPassabilityTests() {
    const vehicle = this.vehicle();

    if (vehicle) {
      return true;
    }

    return false;
  }

  // Check if there's enough room for the player on that position
  canLandOn(x, y) {
    const x1 = Math.floor(x + this.defaultHitboxX);
    const y1 = Math.floor(y + this.defaultHitboxY);

    if (!$gameMap.isTileClear(x1, y1)) {
      return false;
    }

    const x2 = x + this.defaultHitboxX + this.defaultWidth;
    const x2f = CycloneMovement.isRoundNumber(x2) ? x2 -1 : Math.floor(x2);

    if (x1 !== x2f) {
      if (!$gameMap.isTileClear(x2f, y1)) {
        return false;
      }
    }

    const y2 = y + this.defaultHitboxY + this.defaultHeight;
    const y2f = CycloneMovement.isRoundNumber(y2) ? y2 - 1 : Math.floor(y2);

    if (y1 !== y2f) {
      if (!$gameMap.isTileClear(x1, y2f)) {
        return false;
      }

      if (x1 !== x2f) {
        if (!$gameMap.isTileClear(x2f, y2f)) {
          return false;
        }
      }
    }

    return true;
  }
});
