# AngularDebouncing and SwitchMap

This project was generated using Angular CLI version 19.2.1.

# Working
1. User starts typing -> valueChanges emits a new value
2. debounceTime(500) -> RxJS operator that delays the emission of an item from the source observable. In this case wait for 500ms before calling API
3. switchMap() -> It cancels previous request and ensure only the latest request is processed. Previous API calls gets canceled when the user types in new search query. In switchMap only latest emission matters


