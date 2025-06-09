# Description of the Bugs and Fixes in enigma.js

## Bug 1: Plugboard Swap Not Covered

### Location
`plugboardSwap(c, pairs)` function

### Issue
The `plugboardSwap` function was not fully covered in the tests. Specifically, the conditional checks for character swaps (`if (c === a)` and `if (c === b)`) were not exercised in the test cases. As a result, if the plugboard was not configured or the tested characters did not match any plugboard pair, these lines were skipped, leading to incomplete test coverage.

### Fix
To resolve this, additional test cases were added that specifically tested characters that should and should not be swapped according to the plugboard configuration. This ensured that both conditional checks were triggered, covering lines 66 and 67.

## Bug 2: Rotor Stepping Logic Not Covered

### Location
`stepRotors()` method

### Issue
The `stepRotors()` method was not fully tested, particularly the logic where the middle rotor (Rotor II) steps the left rotor (Rotor I) if Rotor II reaches its notch.

Lines 71 and 72 were skipped because the rotor positions and notch configurations used in the tests did not trigger the stepping behavior.

### Fix
Test cases were added to configure the rotors in a way that triggered the stepping logic, including scenarios where a rotor reaches its notch and steps the next rotor. This ensured full coverage of the rotor stepping mechanism.