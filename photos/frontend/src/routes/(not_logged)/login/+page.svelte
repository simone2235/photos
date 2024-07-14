<script>
    import { onMount } from 'svelte';
    import { login1 } from '$lib/auth.js';
	import { goto } from "$app/navigation";

    let username = '';
    let password = '';
    let error = '';
    let showPassword = false;


    
    async function login(event) {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const data = await response.json();
                error = data.error;
                showError();
            } else {
                const data = await response.json();
                console.log(data);
                login1(data.token);
                // window.location.href = '/imagine';
                goto("/album");
            }
        } catch (err) {
            console.error('Errore durante la richiesta di login:', err);
            error = 'Errore durante il login. Riprova più tardi.';
            showError();
        }
    }

    function showError() {
        setTimeout(() => {
            error = '';
        }, 3000);
    }

    function togglePasswordVisibility() {
        const passwordField = document.getElementById('password');
        showPassword = !showPassword;
        passwordField.type = showPassword ? 'text' : 'password';
    }
</script>

<div id="sfondo">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title text-center mb-4">Benvenuto in Photo</h2>
                        {#if error}
                            <div id="error-alert" class="alert alert-danger">{error}</div>
                        {/if}
                        <form on:submit={login}>
                            <div class="form-floating mb-3">
                                <input bind:value={username} type="text" class="form-control" id="username" name="username" placeholder="Username" required>
                                <label for="username">Username</label>
                            </div>
                            <div class="form-floating mb-3" style="position: relative;">
                                <input bind:value={password} type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                                <label for="password">Password</label>
                                <span id="toggle-password" class="password-toggle" on:click={togglePasswordVisibility}>
                                    <i class={showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash-fill'}></i>
                                </span>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Accedi</button>
                            </div>
                        </form>
                        <div class="text-center mt-3">
                            <a href="/register" class="btn btn-link">Non hai un account? Registrati</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
  
    #sfondo {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('../img.jpg');
        position: relative;
    }

    .card {
        margin-bottom: 5rem;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        opacity: 0.95;
    }

    .card-title {
        color: #333;
        font-size: 2rem;
        margin-bottom: 20px;
    }

    .form-control {
        border-radius: 8px;
        padding: 10px;
        font-size: 1.2rem;
    }

    .btn-primary {
        background-color: #333;
        border-color: #333;
        transition: background-color 0.3s, border-color 0.3s;
        padding: 10px 20px;
        font-size: 1.2rem;
    }

    .btn-primary:hover {
        background-color: #555;
        border-color: #555;
    }

    .alert {
        transition: opacity 0.5s;
        margin-top: 10px;
    }

    .password-toggle {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: #aaa;
        font-size: 1.5rem;
    }

    .password-toggle:hover {
        color: #333;
    }
</style>
