import { test, describe } from 'node:test';
import assert from 'node:assert';
import { Ship } from '../src/Ship.js';

describe('Ship', () => {
  const testLocations = ['00', '01', '02'];

  describe('constructor', () => {
    test('should create a ship with correct locations and length', () => {
      const ship = new Ship(testLocations, 3);
      assert.deepStrictEqual(ship.locations, testLocations);
      assert.strictEqual(ship.length, 3);
      assert.deepStrictEqual(ship.hits, [false, false, false]);
    });

    test('should create a copy of locations array', () => {
      const originalLocations = ['10', '11', '12'];
      const testShip = new Ship(originalLocations);
      originalLocations.push('13');
      assert.strictEqual(testShip.locations.includes('13'), false);
    });

    test('should default to length 3 if not specified', () => {
      const defaultShip = new Ship(['20', '21', '22']);
      assert.strictEqual(defaultShip.length, 3);
    });
  });

  describe('hit', () => {
    test('should successfully hit a valid location', () => {
      const ship = new Ship(testLocations, 3);
      const result = ship.hit('01');
      assert.strictEqual(result, true);
      assert.strictEqual(ship.hits[1], true);
    });

    test('should return false for invalid location', () => {
      const ship = new Ship(testLocations, 3);
      const result = ship.hit('99');
      assert.strictEqual(result, false);
      assert.deepStrictEqual(ship.hits, [false, false, false]);
    });

    test('should return false for already hit location', () => {
      const ship = new Ship(testLocations, 3);
      ship.hit('01');
      const result = ship.hit('01');
      assert.strictEqual(result, false);
    });

    test('should hit multiple different locations', () => {
      const ship = new Ship(testLocations, 3);
      assert.strictEqual(ship.hit('00'), true);
      assert.strictEqual(ship.hit('02'), true);
      assert.deepStrictEqual(ship.hits, [true, false, true]);
    });
  });

  describe('isSunk', () => {
    test('should return false for unhit ship', () => {
      const ship = new Ship(testLocations, 3);
      assert.strictEqual(ship.isSunk(), false);
    });

    test('should return false for partially hit ship', () => {
      const ship = new Ship(testLocations, 3);
      ship.hit('00');
      ship.hit('01');
      assert.strictEqual(ship.isSunk(), false);
    });

    test('should return true for completely hit ship', () => {
      const ship = new Ship(testLocations, 3);
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      assert.strictEqual(ship.isSunk(), true);
    });
  });

  describe('hasLocation', () => {
    test('should return true for valid location', () => {
      const ship = new Ship(testLocations, 3);
      assert.strictEqual(ship.hasLocation('01'), true);
    });

    test('should return false for invalid location', () => {
      const ship = new Ship(testLocations, 3);
      assert.strictEqual(ship.hasLocation('99'), false);
    });

    test('should check all locations', () => {
      const ship = new Ship(testLocations, 3);
      assert.strictEqual(ship.hasLocation('00'), true);
      assert.strictEqual(ship.hasLocation('01'), true);
      assert.strictEqual(ship.hasLocation('02'), true);
      assert.strictEqual(ship.hasLocation('03'), false);
    });
  });

  describe('isLocationHit', () => {
    test('should return false for unhit location', () => {
      const ship = new Ship(testLocations, 3);
      assert.strictEqual(ship.isLocationHit('01'), false);
    });

    test('should return true for hit location', () => {
      const ship = new Ship(testLocations, 3);
      ship.hit('01');
      assert.strictEqual(ship.isLocationHit('01'), true);
    });

    test('should return false for invalid location', () => {
      const ship = new Ship(testLocations, 3);
      assert.strictEqual(ship.isLocationHit('99'), false);
    });
  });

  describe('getStatus', () => {
    test('should return complete status for unhit ship', () => {
      const ship = new Ship(testLocations, 3);
      const status = ship.getStatus();
      const expected = {
        locations: ['00', '01', '02'],
        hits: [false, false, false],
        hitCount: 0,
        isSunk: false,
        length: 3
      };
      assert.deepStrictEqual(status, expected);
    });

    test('should return status for partially hit ship', () => {
      const ship = new Ship(testLocations, 3);
      ship.hit('00');
      ship.hit('02');
      const status = ship.getStatus();
      const expected = {
        locations: ['00', '01', '02'],
        hits: [true, false, true],
        hitCount: 2,
        isSunk: false,
        length: 3
      };
      assert.deepStrictEqual(status, expected);
    });

    test('should return status for sunk ship', () => {
      const ship = new Ship(testLocations, 3);
      ship.hit('00');
      ship.hit('01');
      ship.hit('02');
      const status = ship.getStatus();
      const expected = {
        locations: ['00', '01', '02'],
        hits: [true, true, true],
        hitCount: 3,
        isSunk: true,
        length: 3
      };
      assert.deepStrictEqual(status, expected);
    });

    test('should return copies of arrays', () => {
      const ship = new Ship(testLocations, 3);
      const status = ship.getStatus();
      status.locations.push('03');
      status.hits.push(true);
      assert.strictEqual(ship.locations.length, 3);
      assert.strictEqual(ship.hits.length, 3);
    });
  });
}); 