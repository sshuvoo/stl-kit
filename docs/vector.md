# Vector — STL-Style Dynamic Array

> Part of [`stl-kit`](https://www.npmjs.com/package/stl-kit)

## Overview

`Vector` is a high-performance, STL-inspired dynamic array for TypeScript and JavaScript. It closely mimics C++'s `std::vector`, extending the native `Array` with additional methods, strong typing, and STL-style semantics. `Vector` supports advanced features such as factory-based emplacement, front/back operations, and robust assignment and comparison utilities, making it ideal for developers seeking familiar C++ container patterns in JS/TS projects.

- **Extends**: Native `Array` — all array methods are available.
- **STL Features**: Methods and properties inspired by C++ STL containers.
- **Factory Support**: Emplacement methods can construct elements using a custom factory function.

---

## Constructor

```ts
new Vector<T, A = [T]>(options?: {
  initValues?: T[];
  factory?: (...args: A) => T;
})
```

- **`initValues`**: Optional. An array of initial values to populate the vector.
- **`factory`**: Optional. A function used by emplacement methods (`emplaceAt`, `emplaceFront`, `emplaceBack`) to construct new elements from arguments.
- **Empty Initialization**: If no options are provided, creates an empty vector.

**Factory Usage**: If a factory is provided, emplacement methods use it to construct new elements. If not, the first argument is inserted as-is.

---

## API Reference

### Iterators

#### `begin()`

```ts
begin(): IterableIterator<T>
```

- **Description**: Returns a forward iterator (same as `Symbol.iterator`). STL analogy: `vector.begin()`.
- **Returns**: Iterator over elements from front to back.
- **Example**:
  ```ts
  for (const x of vector.begin()) { ... }
  // or even shorthand:
  for (const x of vector) { ... }
  ```

#### `rbegin()`

```ts
rbegin(): IterableIterator<T>
```

- **Description**: Returns a reverse iterator (from back to front). STL analogy: `vector.rbegin()`.
- **Returns**: Iterator over elements from back to front.
- **Example**:
  ```ts
  for (const x of vector.rbegin()) { ... }
  ```

---

### Capacity & State

#### `isEmpty()`

```ts
isEmpty(): boolean
```

- **Description**: Checks if the vector is empty. STL analogy: `vector.empty()`.
- **Returns**: `true` if empty, else `false`.

#### `clear()`

```ts
clear(): void
```

- **Description**: Removes all elements. STL analogy: `vector.clear()`.

---

### Element Access & Modification

#### `insertAt()`

```ts
insertAt(index: number, val: T): number
```

- **Description**: Inserts `val` at `index`. STL analogy: `vector.insert()`.
- **Parameters**:
  - `index`: Position to insert at (0-based).
  - `val`: Value to insert.
- **Returns**: New length of the vector.
- **Edge Cases**: Throws `RangeError` if `index` is out of `[0, length]`.
- **Example**:
  ```ts
  v.insertAt(1, 42)
  ```

#### `eraseAt()`

```ts
eraseAt(index: number): T | undefined
```

- **Description**: Removes and returns the element at `index`. STL analogy: `vector.erase()`.
- **Parameters**:
  - `index`: Position to erase (0-based).
- **Returns**: The removed element, or `undefined` if not found.
- **Edge Cases**: Throws `RangeError` if `index` is out of `[0, length-1]`.

#### `resize()`

```ts
resize(size: number): void
```

- **Description**: Changes the vector's length. STL analogy: `vector.resize()`.
- **Parameters**:
  - `size`: New size (must be `0 <= size < 2^32`).
- **Edge Cases**: Throws `RangeError` if size is invalid.

#### `pushFront()`

```ts
pushFront(val: T): number
```

- **Description**: Inserts `val` at the front. STL analogy: `vector.insert(begin(), val)`.
- **Returns**: New length.
- **Edge Cases**: If no argument, returns current length.

#### `pushBack()`

```ts
pushBack(val: T): number
```

- **Description**: Appends `val` at the end. STL analogy: `vector.push_back()`.
- **Returns**: New length.
- **Edge Cases**: If no argument, returns current length.

#### `popFront()`

```ts
popFront(): T | undefined
```

- **Description**: Removes and returns the first element. STL analogy: `vector.erase(begin())`.
- **Returns**: The removed element, or `undefined` if empty.

#### `popBack()`

```ts
popBack(): T | undefined
```

- **Description**: Removes and returns the last element. STL analogy: `vector.pop_back()`.
- **Returns**: The removed element, or `undefined` if empty.

---

### Emplacement Methods

#### `emplaceAt()`

```ts
emplaceAt(index: number, ...args: A): number
```

- **Description**: Constructs and inserts an element at `index` using the factory (if provided), or inserts the first argument as-is. STL analogy: `vector.emplace()`.
- **Parameters**:
  - `index`: Position to insert at.
  - `...args`: Arguments for the factory.
- **Returns**: New length.
- **Edge Cases**: Throws `RangeError` if `index` is out of range. If no factory, inserts `args[0]` as value.

#### `emplaceFront()`

```ts
emplaceFront(...args: A): number
```

- **Description**: Constructs and inserts an element at the front using the factory (if provided), or inserts the first argument as-is. STL analogy: `vector.emplace_front()`.
- **Returns**: New length.

#### `emplaceBack()`

```ts
emplaceBack(...args: A): number
```

- **Description**: Constructs and appends an element at the end using the factory (if provided), or inserts the first argument as-is. STL analogy: `vector.emplace_back()`.
- **Returns**: New length.

---

### Assignment & Comparison

#### `assign()`

Overloads:

```ts
assign(count: number, value: T): void
assign(values: T[], start?: number, end?: number): void
```

- **Description**: Replaces contents with either `count` copies of `value`, or a slice of `values`.
- **Parameters**:
  - `count`, `value`: Number of times to insert `value`.
  - `values`: Source array.
  - `start`, `end`: Optional slice indices (default: `0`, `values.length`).
- **Edge Cases**: Throws `RangeError` for negative count or invalid slice. Throws `TypeError` for invalid arguments.
- **Examples**:
  ```ts
  v.assign(3, 7) // [7, 7, 7]
  v.assign([1, 2, 3, 4], 1, 3) // [2, 3]
  ```

#### `equals()`

```ts
equals(other: Vector<T>, compareFn?: (a: T, b: T) => boolean): boolean
```

- **Description**: Checks if two vectors are equal, optionally using a custom comparator. STL analogy: `vector == other`.
- **Parameters**:
  - `other`: Vector to compare.
  - `compareFn`: Optional equality function (default: `a === b`).
- **Returns**: `true` if equal, else `false`.

---

### Properties

#### `front`

```ts
get front(): T | undefined
set front(val: T)
```

- **Description**: Gets or sets the first element. STL analogy: `vector.front()`.
- **Edge Cases**: Throws `RangeError` if setting on empty vector. Getting returns `undefined` if empty.

#### `back`

```ts
get back(): T | undefined
set back(val: T)
```

- **Description**: Gets or sets the last element. STL analogy: `vector.back()`.
- **Edge Cases**: Throws `RangeError` if setting on empty vector. Getting returns `undefined` if empty.

---

## Usage Examples

### Basic Usage

```ts
import { Vector } from 'stl-kit'

const v = new Vector<number>({ initValues: [1, 2, 3] })
v.pushBack(4) // [1,2,3,4]
v.pushFront(0) // [0,1,2,3,4]
v.popBack() // 4
v.popFront() // 0
```

### Emplacement with Factory

```ts
class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}
}
const v = new Vector<Point, [number, number]>({
  factory: (x, y) => new Point(x, y),
})
v.emplaceBack(1, 2) // [Point(1,2)]
v.emplaceFront(0, 0) // [Point(0,0), Point(1,2)]
v.emplaceAt(1, 5, 5) // [Point(0,0), Point(5,5), Point(1,2)]
```

### Assign and Equality

```ts
const v = new Vector<number>()
v.assign(3, 7) // [7,7,7]
v.assign([1, 2, 3, 4], 1, 3) // [2,3]

const v2 = new Vector<number>({ initValues: [2, 3] })
v.equals(v2) // true
```

### Iteration

```ts
for (const x of v.begin()) { ... }
for (const x of v.rbegin()) { ... }
```

---

## Caveats & Edge Cases

- **Empty Vector**: `front`/`back` getters return `undefined`. Setters throw `RangeError` if vector is empty.
- **Invalid Indices**: `insertAt`, `eraseAt`, `resize`, and `assign` throw `RangeError` for out-of-bounds or invalid arguments.
- **Argument Checks**: Many methods check argument count and types; invalid usage throws errors.
- **Emplace Fallback**: If no factory is provided, emplacement methods insert the first argument as-is.

---

## Comparison to Native JS Arrays

- **When to Use `Vector`**: Prefer `Vector` when you need STL-style methods, strong typing, or factory-based construction.
- **Extra Features**: `Vector` adds front/back operations, STL-style assignment, emplacement, and equality checks not present in native arrays.
- **STL Familiarity**: C++/STL users will find the API and semantics familiar and robust.

---

## API Reference Table

| Method / Property       | Description                                                            | Signature                                                                       |
| ----------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `constructor(options?)` | Create a new vector, optionally with initial values and a factory.     | `new Vector<T, A>(options?: { initValues?: T[], factory?: (...args: A) => T })` |
| `begin()`               | Get forward iterator (same as Symbol.iterator).                        | `begin(): IterableIterator<T>`                                                  |
| `rbegin()`              | Get reverse iterator (from back to front).                             | `rbegin(): IterableIterator<T>`                                                 |
| `isEmpty()`             | Check if the vector is empty.                                          | `isEmpty(): boolean`                                                            |
| `clear()`               | Remove all elements.                                                   | `clear(): void`                                                                 |
| `insertAt(index, val)`  | Insert value at the specified index.                                   | `insertAt(index: number, val: T): number`                                       |
| `eraseAt(index)`        | Remove and return value at the specified index.                        | `eraseAt(index: number): T \| undefined`                                        |
| `resize(size)`          | Change the vector's length.                                            | `resize(size: number): void`                                                    |
| `pushFront(val)`        | Insert value at the front.                                             | `pushFront(val: T): number`                                                     |
| `pushBack(val)`         | Insert value at the back.                                              | `pushBack(val: T): number`                                                      |
| `popFront()`            | Remove and return value from the front.                                | `popFront(): T \| undefined`                                                    |
| `popBack()`             | Remove and return value from the back.                                 | `popBack(): T \| undefined`                                                     |
| `emplaceAt(idx, ...a)`  | Construct and insert value at index using factory or arguments.        | `emplaceAt(index: number, ...args: A): number`                                  |
| `emplaceFront(...args)` | Construct and insert value at the front using factory or arguments.    | `emplaceFront(...args: A): number`                                              |
| `emplaceBack(...args)`  | Construct and insert value at the back using factory or arguments.     | `emplaceBack(...args: A): number`                                               |
| `assign(count, value)`  | Fill vector with `count` copies of `value`.                            | `assign(count: number, value: T): void`                                         |
| `assign(values, s, e)`  | Fill vector with a slice of `values` from `s` to `e` (exclusive).      | `assign(values: T[], start?: number, end?: number): void`                       |
| `equals(other, cmp?)`   | Check if two vectors are equal (optionally using a custom comparator). | `equals(other: Vector<T>, compareFn?: (a: T, b: T) => boolean): boolean`        |
| `front`                 | Get/set value at the front.                                            | `front: T \| undefined` (getter/setter)                                         |
| `back`                  | Get/set value at the back.                                             | `back: T \| undefined` (getter/setter)                                          |

---

<sub>If you found any bug, please create an issue to help make this library more reliable and efficient. Your feedback is highly appreciated!</sub>
