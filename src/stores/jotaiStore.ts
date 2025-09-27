import { createStore } from "jotai/vanilla"

// A single shared store to be used both in React (Provider)
// and outside React (services/guards) to avoid store mismatch.
export const appStore = createStore()
