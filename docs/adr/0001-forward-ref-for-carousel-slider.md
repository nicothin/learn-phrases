# ADR-0001: Forward Ref + useImperativeHandle for CarouselSlider

**Status:** Accepted

CarouselSlider is the first and only component in the project that requires an imperative handle (`goToNext` / `goToPrev` / `activeIndex` / `canGoNext` / `canGoPrev` / `currentItem`) for control from a parent component.

Alternatives considered: extract state into a custom hook and pass controlled props to the component (purely presentational), or pass a DOM ref to an external hook. The former adds boilerplate on the consumer side, the latter is an anti-pattern (a hook cannot reliably bind to another component's ref).

Decision: `forwardRef` + `useImperativeHandle`. This is the idiomatic React pattern for imperative handles — predictable API, minimal asymmetry with the rest of the codebase.
