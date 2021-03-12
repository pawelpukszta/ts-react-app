// React Hook recipe from https://usehooks.com
import { useReducer } from 'react';

export function useToggle(initialValue = false) {
    return useReducer((state) => !state, initialValue);
}