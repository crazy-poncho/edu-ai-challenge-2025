/**
 * Represents a ship in the Sea Battle game
 */
export class Ship {
  constructor(locations, length = 3) {
    this.locations = [...locations]; // Array of location strings like "00", "01", "02"
    this.hits = new Array(length).fill(false);
    this.length = length;
  }

  /**
   * Attempts to hit the ship at a specific location
   * @param {string} location - Location string like "34"
   * @returns {boolean} - True if hit was successful, false if already hit or location not found
   */
  hit(location) {
    const index = this.locations.indexOf(location);
    if (index === -1) {
      return false; // Location not part of this ship
    }
    
    if (this.hits[index]) {
      return false; // Already hit
    }
    
    this.hits[index] = true;
    return true;
  }

  /**
   * Checks if the ship is completely sunk
   * @returns {boolean} - True if all parts of the ship are hit
   */
  isSunk() {
    return this.hits.every(hit => hit === true);
  }

  /**
   * Checks if a specific location is part of this ship
   * @param {string} location - Location string like "34"
   * @returns {boolean} - True if location is part of this ship
   */
  hasLocation(location) {
    return this.locations.includes(location);
  }

  /**
   * Checks if a specific location on this ship has been hit
   * @param {string} location - Location string like "34"
   * @returns {boolean} - True if location is hit, false otherwise
   */
  isLocationHit(location) {
    const index = this.locations.indexOf(location);
    return index !== -1 && this.hits[index];
  }

  /**
   * Gets the status of the ship
   * @returns {Object} - Object containing ship status information
   */
  getStatus() {
    return {
      locations: [...this.locations],
      hits: [...this.hits],
      hitCount: this.hits.filter(hit => hit).length,
      isSunk: this.isSunk(),
      length: this.length
    };
  }
} 