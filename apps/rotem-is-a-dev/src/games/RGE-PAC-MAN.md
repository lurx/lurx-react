# Pac-Man — Game Reference

## Core Concept

Pac-Man is a maze-chase arcade game. The player navigates a yellow, circular character through a maze, eating dots (pellets) while avoiding four ghosts. Eating all dots completes the level.

## Board

- Fixed maze layout with walls, corridors, and two tunnel exits (left/right wrap-around)
- The original maze is 28 columns x 31 rows
- One ghost house (pen) in the center where ghosts spawn
- Four power pellet positions (one in each corner area)

## Pac-Man

- Moves in four directions: UP, DOWN, LEFT, RIGHT
- Continuous movement — Pac-Man keeps moving in the current direction until hitting a wall
- "Cornering" — the player can input the next direction before reaching an intersection, and Pac-Man turns as soon as possible
- Moves slightly faster than ghosts in normal mode
- Eating a dot briefly pauses Pac-Man (1 frame for dots, 3 frames for power pellets in the original)

## Dots (Pellets)

- **Small dots**: 240 per level, worth 10 points each
- **Power pellets**: 4 per level, worth 50 points each
- Eating a power pellet triggers "frightened" mode for all ghosts
- Level is complete when all 244 dots are eaten

## Ghosts

Four ghosts, each with a unique personality defined by their targeting behavior:

### Ghost Names & Colors

| Ghost | Color | Nickname | Japanese Name |
|-------|-------|----------|---------------|
| Blinky | Red | Shadow | Oikake (chaser) |
| Pinky | Pink | Speedy | Machibuse (ambusher) |
| Inky | Cyan | Bashful | Kimagure (fickle) |
| Clyde | Orange | Pokey | Otoboke (feigning ignorance) |

### Ghost Modes

Ghosts alternate between three behavioral modes:

1. **Chase** — Each ghost targets a specific tile based on its personality:
   - **Blinky**: Targets Pac-Man's current tile directly
   - **Pinky**: Targets 4 tiles ahead of Pac-Man's current direction
   - **Inky**: Uses a vector from Blinky's position through a point 2 tiles ahead of Pac-Man, doubled — the most unpredictable
   - **Clyde**: Targets Pac-Man when far away (>8 tiles), but switches to his scatter corner when close

2. **Scatter** — Each ghost retreats to its assigned corner of the maze and loops around it:
   - Blinky: top-right
   - Pinky: top-left
   - Inky: bottom-right
   - Clyde: bottom-left

3. **Frightened** — Triggered by power pellets. All ghosts:
   - Turn blue/white (flashing when about to end)
   - Reverse direction immediately
   - Move randomly at intersections
   - Move slower than normal
   - Can be eaten by Pac-Man
   - Duration decreases with each level (eventually 0 on later levels)

### Ghost Movement Rules

- Ghosts cannot reverse direction voluntarily (except when mode switches, which forces a reversal)
- At intersections, ghosts choose the direction that minimizes Euclidean distance to their target tile
- Ghosts cannot move upward in certain specific tiles near the ghost house (a quirk of the original)
- Ghosts move through the tunnel at half speed

### Ghost House

- Pinky starts outside the house, Blinky above it
- Inky and Clyde start inside and leave based on dot counters
- Eaten ghosts return to the house as "eyes" (fast), regenerate, and leave again

## Scoring

| Item | Points |
|------|--------|
| Small dot | 10 |
| Power pellet | 50 |
| 1st ghost eaten | 200 |
| 2nd ghost eaten | 400 |
| 3rd ghost eaten | 800 |
| 4th ghost eaten | 1,600 |
| Bonus fruit | Varies by level (100-5,000) |

Ghost combo resets when frightened mode ends.

## Bonus Fruit

Appears twice per level (after 70 and 170 dots eaten), stays for ~10 seconds:

| Level | Fruit | Points |
|-------|-------|--------|
| 1 | Cherry | 100 |
| 2 | Strawberry | 300 |
| 3-4 | Orange | 500 |
| 5-6 | Apple | 700 |
| 7-8 | Melon | 1,000 |
| 9-10 | Galaxian | 2,000 |
| 11-12 | Bell | 3,000 |
| 13+ | Key | 5,000 |

## Speed & Difficulty Progression

- Pac-Man and ghost speeds increase with level
- Frightened mode duration decreases (0 seconds from level 19+)
- Blinky has "Cruise Elroy" mode — when few dots remain, he speeds up and chases even during scatter

## Chase/Scatter Timing (Level 1)

The game alternates between scatter and chase in a fixed pattern:

1. Scatter (7 sec)
2. Chase (20 sec)
3. Scatter (7 sec)
4. Chase (20 sec)
5. Scatter (5 sec)
6. Chase (20 sec)
7. Scatter (5 sec)
8. Chase (indefinite)

## Extra Lives

- One extra life at 10,000 points (configurable in the original arcade)

## Death

- Pac-Man dies when touching a ghost in chase or scatter mode
- Death animation plays (Pac-Man shrinks/deflates)
- Ghosts reset to their starting positions
- Dots are NOT reset (continue from where you left off)
- Game over when all lives are lost

## Level 256 Bug (Kill Screen)

The original arcade has a famous bug at level 256 — an integer overflow corrupts the right half of the maze, making it unbeatable.

---

# RGE Implementation Plan — Level 1

## Scope

Single-level Pac-Man with all core mechanics: maze, dots, power pellets, four ghosts with unique AI, cherry bonus fruit, 3 lives. No multi-level progression, no Cruise Elroy, no fruit beyond cherry.

## Entities

### `PacmanEntity`

```text
position: Position          — current grid tile {x, y}
direction: Direction        — current movement direction
nextDirection: Direction | null — buffered input (for cornering)
cellSize: number
renderer: ReactElement
```

### `GhostEntity` (one per ghost, stored as `ghosts` record keyed by ghost name)

```typescript
name: GhostName             — 'blinky' | 'pinky' | 'inky' | 'clyde'
position: Position
direction: Direction
mode: GhostMode             — 'chase' | 'scatter' | 'frightened' | 'eaten'
scatterTarget: Position     — fixed corner tile
cellSize: number
renderer: ReactElement
```

### `MazeEntity`

```typescript
grid: CellType[][]          — 2D grid: 'wall' | 'path' | 'dot' | 'power' | 'empty' | 'ghost-house' | 'ghost-door'
dotsRemaining: number
totalDots: number
renderer: ReactElement
```

### `FruitEntity`

```
position: Position | null   — null when inactive
active: boolean
spawnedAt: number           — timestamp for despawn timer
cellSize: number
renderer: ReactElement
```

### `BoardEntity` (no renderer — config + runtime state)

```
width: number               — 28
height: number              — 31
cellSize: number            — 16
pacmanTickMs: number        — ~80ms (Pac-Man movement speed)
ghostTickMs: number         — ~90ms (ghost base speed)
frightenedTickMs: number    — ~120ms (ghost frightened speed)
lastPacmanTick: number
lastGhostTick: number
keyScheme: KeyScheme
pendingActions: Direction[]
score: number
lives: number
ghostsEatenCombo: number    — resets when frightened ends (0-4, scores 200/400/800/1600)
modeTimer: number           — time in current scatter/chase phase
modePhaseIndex: number      — index into SCATTER_CHASE_PATTERN
currentGhostMode: 'chase' | 'scatter'
frightenedTimer: number     — remaining frightened time (0 = not active)
dotsEaten: number           — for fruit spawn trigger
```

## Maze Layout

Store the level 1 maze as a constant 2D array (28x31). Each cell is a number mapped to a `CellType`:

```
0 = wall
1 = dot
2 = power pellet
3 = empty (no dot, passable)
4 = ghost house interior
5 = ghost door (ghosts pass through, Pac-Man cannot)
6 = tunnel (wraps horizontally)
```

Define `LEVEL_1_MAZE` as a `number[][]` constant. Convert to `CellType[][]` at entity creation.

## Systems Pipeline

Run in this order every frame:

### 1. `handleInput`

- Read `board.pendingActions`, apply the most recent valid direction
- Store as `pacman.nextDirection` (buffered — only applied if the tile ahead is passable)
- Clear `pendingActions`

### 2. `updateMode`

- Advance `board.modeTimer` by time delta
- Check `SCATTER_CHASE_PATTERN` for mode transitions
- On transition: flip `board.currentGhostMode`, force all ghosts (not frightened/eaten) to reverse direction
- Decrement `board.frightenedTimer`; when it hits 0, revert all frightened ghosts to current mode, reset `ghostsEatenCombo`

### 3. `movePacman`

- Tick-gated by `board.pacmanTickMs`
- If `nextDirection` is valid (tile ahead is passable), update `direction` to `nextDirection`
- Move one tile in current `direction` (if passable; otherwise stop)
- Handle tunnel wrap (x < 0 → x = width-1, x >= width → x = 0)

### 4. `checkDotCollision`

- If Pac-Man's tile is `dot`: set to `empty`, score += 10, dotsRemaining--, dotsEaten++
- If Pac-Man's tile is `power`: set to `empty`, score += 50, dotsRemaining--, dotsEaten++, trigger frightened mode (set all non-eaten ghosts to frightened, reverse their direction, set `frightenedTimer` to 6000ms, reset `ghostsEatenCombo`)
- Check fruit spawn triggers (dotsEaten === 70 or 170)

### 5. `moveGhosts`

- Tick-gated by `board.ghostTickMs` (or `frightenedTickMs` for frightened ghosts)
- For each ghost:
  - **eaten**: move toward ghost house at double speed; when arrived, set mode to current board mode
  - **frightened**: pick a random valid direction at intersections (no reversal)
  - **chase**: compute target tile based on ghost personality, pick direction minimizing distance to target
  - **scatter**: target is the ghost's fixed `scatterTarget` corner
- At each intersection, choose the direction (excluding reverse) whose neighbor tile is closest (Euclidean) to the target
- Tunnel wrap applies to ghosts too

### 6. `checkGhostCollision`

- For each ghost, if ghost.position equals pacman.position:
  - **frightened**: ghost becomes `eaten`, score += 200/400/800/1600 based on `ghostsEatenCombo++`, dispatch `'ghost-eaten'`
  - **chase/scatter**: dispatch `'pacman-died'`

### 7. `checkFruit`

- If fruit is active and Pac-Man is on fruit tile: score += 100 (cherry), deactivate fruit, dispatch `'fruit-eaten'`
- If fruit is active and time expired (~10 sec): deactivate fruit
- If `dotsEaten` hits 70 or 170 and fruit is not active: activate fruit at center-bottom position

### 8. `checkWinLose`

- If `dotsRemaining === 0`: dispatch `'level-complete'`
- (lives check happens in the component's event handler after `'pacman-died'`)

## Ghost Targeting (Chase Mode)

```
blinky: target = pacman.position
pinky:  target = pacman.position + (4 tiles in pacman.direction)
inky:   pivot  = pacman.position + (2 tiles in pacman.direction)
        target = blinky.position + 2 * (pivot - blinky.position)
clyde:  distance = euclidean(clyde.position, pacman.position)
        target = distance > 8 ? pacman.position : clyde.scatterTarget
```

## Ghost House Release

For level 1, use a simple dot counter:

- Blinky: starts outside, immediately active
- Pinky: released after 0 dots eaten
- Inky: released after 30 dots eaten
- Clyde: released after 60 dots eaten

When released, ghost moves up through the ghost door and starts in the current mode.

## Renderers

### `PacmanRenderer`

- Yellow circle with animated mouth (CSS animation or rotating arc)
- Rotates to face current direction
- Uses absolute positioning: `left: x * cellSize, top: y * cellSize`

### `GhostRenderer`

- Colored body (rounded top, wavy bottom — CSS or SVG)
- Eyes that look in the movement direction
- **Frightened**: blue body, generic scared face; flash white near end
- **Eaten**: eyes only (no body)

### `MazeRenderer`

- Render walls as colored borders/blocks
- Render dots as small circles
- Render power pellets as larger pulsing circles (CSS animation)
- The maze is static after creation — only dots change (removed on eat)

### `FruitRenderer`

- Cherry icon (FontAwesome or SVG) at the fruit position
- Only rendered when `fruit.active`

## Component Structure

```
rge-pacman-game/
├── rge-pacman-game.component.tsx
├── rge-pacman-game.types.ts
├── rge-pacman-game.constants.ts       — maze data, colors, speeds, scatter/chase timing
├── rge-pacman-game.helpers.ts         — pathfinding, target computation, maze utilities
├── rge-pacman-game.module.scss
├── rge-pacman.game.tsx                — lazy export wrapper
├── index.ts
├── systems/
│   ├── handle-input.system.ts
│   ├── update-mode.system.ts
│   ├── move-pacman.system.ts
│   ├── check-dot-collision.system.ts
│   ├── move-ghosts.system.ts
│   ├── move-ghosts.helpers.ts         — targeting logic, pathfinding
│   ├── check-ghost-collision.system.ts
│   ├── check-fruit.system.ts
│   ├── check-win-lose.system.ts
│   └── index.ts
├── renderers/
│   ├── pacman-renderer.component.tsx
│   ├── ghost-renderer.component.tsx
│   ├── maze-renderer.component.tsx
│   ├── fruit-renderer.component.tsx
│   └── index.ts
├── components/
│   ├── game-controls/
│   ├── game-overlay/
│   └── index.ts
└── __tests__/
    ├── handle-input.system.test.ts
    ├── update-mode.system.test.ts
    ├── move-pacman.system.test.ts
    ├── check-dot-collision.system.test.ts
    ├── move-ghosts.system.test.ts
    ├── move-ghosts.helpers.test.ts
    ├── check-ghost-collision.system.test.ts
    ├── check-fruit.system.test.ts
    ├── check-win-lose.system.test.ts
    ├── pacman-renderer.test.tsx
    ├── ghost-renderer.test.tsx
    ├── maze-renderer.test.tsx
    ├── game-controls.test.tsx
    ├── game-overlay.test.tsx
    └── rge-pacman-game.test.tsx
```

## Game Events

| Event | Trigger | Component Response |
|-------|---------|-------------------|
| `'dot-eaten'` | Pac-Man eats a dot | Update score display |
| `'power-eaten'` | Pac-Man eats power pellet | Update score, maybe flash UI |
| `'ghost-eaten'` | Pac-Man eats frightened ghost | Show combo points, update score |
| `'fruit-eaten'` | Pac-Man eats cherry | Update score |
| `'pacman-died'` | Ghost touches Pac-Man | Decrement lives, reset positions (or game over if lives === 0) |
| `'level-complete'` | All dots eaten | Set phase to `'won'` |

## Game Lifecycle

```
idle → playing → (pacman-died → lives > 0 ? reset positions : lost)
                → (level-complete → won)
```

On `pacman-died` with lives remaining: don't swap entities — just reset Pac-Man and ghost positions, keep the maze (dots stay eaten). On game over or win: show overlay.

## Simplifications for v1

- No multi-level progression (single level, single speed)
- No Cruise Elroy (Blinky doesn't speed up when dots are low)
- No eating pause (Pac-Man doesn't pause when eating dots)
- No ghost-house upward restriction tiles
- Cherry only (no other fruits)
- Fixed 6-second frightened duration
- No death animation (instant reset)
- No sound effects
