
import { writable } from "svelte/store";


export const isLogged = writable(localStorage.getItem('logged') ?? undefined);

