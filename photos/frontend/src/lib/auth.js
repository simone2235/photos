import { goto } from "$app/navigation";
import { isLogged } from "./store";

export function login1(jwt) {

    console.log(jwt)
    localStorage.setItem("logged", jwt);
    isLogged.set(jwt);
}

export function logout1() {
    localStorage.removeItem("logged")
    isLogged.set(undefined);
    goto("/login");
}
