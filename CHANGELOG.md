# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

# [5.4.1] - 2025-08-28

### Changed

- `LinkedList` getters, setters and accessors were tightened to follow
  STL-like behaviour: accessing or mutating `front`/`back` or popping from
  an empty list now throws a clear `Error` instead of returning `undefined`.

### Documentation

- Updated `docs/linked-list.md` to document the stricter empty-list
  behavior, revised examples, and robust explanations.

# [5.4.0] - 2025-08-23

### Removed

- Data Structure: `Heap` has been removed from the public API and repository.
  Users relying on `Heap` should migrate to `PriorityQueue` which now
  provides equivalent (and more flexible) behaviour via custom comparators.

### Changed

- `PriorityQueue` upgraded to be fully flexible: it can operate as a min-heap
  or max-heap depending on the provided `compareFn`.
- Updated `README.md` and examples to reflect the removal of `Heap` and the
  enhanced `PriorityQueue` behaviour.

### Documentation

- Updated `docs/priority-queue.md` to show min-heap and max-heap examples,
  migration notes for former `Heap` users, and additional beginner-friendly
  explanations.

### Minor

- Miscellaneous small refactors, test updates, and README polish.

# [5.3.0] - 2025-08-12

### Added

- Data Structure: `PriorityQueue` (max-heap by default, supports numbers and custom objects with priorities)
- Documentation: `docs/priority-queue.md` with comprehensive explanations, examples, and full API reference
- Updated `README.md` to include PriorityQueue, improved SEO, and added quick usage examples for all data structures

# [5.2.0] - 2025-08-12

### Added

- Data Structure: `Heap` (max heap by default, min heap via compareFn)
- Documentation: `docs/heap.md` with beginner-friendly and professional explanations, examples, and API reference

---

## [5.1.1] - 2025-07-03

### Changed

- Updated `README.md` with SEO improvements
- Updated `package.json` to fix CommonJS/ESM entry configuration

---

## [5.1.0] - 2025-07-03

### Added

- New methods added to `Stack` and `Queue`

### Fixed

- Fixed potential bugs in `Stack` and `Queue` implementations

---

## [5.0.0] - 2025-07-03

### Added

- Data Structure: `Vector`
- Documentation: `docs/vector.md` for detailed API docs

## [4.1.0] - 2025-07-02

### Added

- New methods added to `LinkedList`

### Fixed

- Bug fixes in `LinkedList` implementation

### Changed

- Updated documentation: `docs/linked-list.md` with new methods and improvements

---

## [4.0.0] - 2025-07-01

### Added

- Data Structure: `Deque`
- Documentation: `docs/deque.md` for detailed API docs

## [3.0.0] - 2025-06-30

### Added

- Data Structure: `Queue`
- Documentation: `docs/queue.md` for detailed API docs
- Added new method .toArray() in Stack and Queue

---

## [2.0.0] - 2025-06-30

### Added

- Data Structure: `Stack`
- Documentation moved to `docs/` folder
- Added `docs/linked-list.md` and `docs/Stack.md` for detailed API docs

### Changed

- README.md redesigned as entry point, now links to docs

---

## [1.0.0] - 2025-06-29

### Added

- Initial release of `stl-kit`
- Data Structures: `LinkedList`
- TypeScript definitions included
