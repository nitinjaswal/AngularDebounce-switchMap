# AngularDebouncing and SwitchMap
# AngularDebouncing and SwitchMap

This project was generated using Angular CLI version 19.2.1.

# switchMap
1. User starts typing -> valueChanges emits a new value
2. debounceTime(500) -> RxJS operator that delays the emission of an item from the source observable. In this case wait for 500ms before calling API
3. switchMap -> It cancels previous request and ensure only the latest request is processed. Previous API calls gets canceled when the user types in new search query. In switchMap only latest emission matters


# concatMap
1. concatMap -> It takses value from the source observable and trandforms each value into an inner observable, and then susbscribes to these inner observables one at a time
2. It is useful when we have series of HTTP requests that must be executed in a particualar order
3. Unlike switchMap, which cancels previous observables when a new value arrives, concatMap allows all inner observables to complete.

# concatMap use cases
1. Ordered HTTP requests: When you need to make multiple API calls in a specific sequence, such as when one API call depends on the result of the previous one

# Problem with manual ordering in subscribe
1. Nested subscribe calls(callback hell)
2. Error handling is more complex
3. Readability and Maintainability issue
