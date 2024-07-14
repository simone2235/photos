<script>
    import { onMount } from 'svelte';

    let username = '';
    let password = '';
    let confirmPassword = '';
    let error = '';

    function togglePasswordVisibility() {
        const passwordField = document.getElementById('password');
        const passwordToggleIcon = document.getElementById('password-toggle-icon');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            passwordToggleIcon.classList.remove('bi-eye-fill');
            passwordToggleIcon.classList.add('bi-eye-slash-fill');
        } else {
            passwordField.type = 'password';
            passwordToggleIcon.classList.remove('bi-eye-slash-fill');
            passwordToggleIcon.classList.add('bi-eye-fill');
        }
    }

    function toggleConfirmPasswordVisibility() {
        const confirmPasswordField = document.getElementById('confirm-password');
        const confirmPasswordToggleIcon = document.getElementById('confirm-password-toggle-icon');
        if (confirmPasswordField.type === 'password') {
            confirmPasswordField.type = 'text';
            confirmPasswordToggleIcon.classList.remove('bi-eye-fill');
            confirmPasswordToggleIcon.classList.add('bi-eye-slash-fill');
        } else {
            confirmPasswordField.type = 'password';
            confirmPasswordToggleIcon.classList.remove('bi-eye-slash-fill');
            confirmPasswordToggleIcon.classList.add('bi-eye-fill');
        }
    }

    async function register(event) {
        event.preventDefault();
        if (username.length < 4 || username.length > 10) {
            error = 'Username deve essere tra 4 e 10 caratteri.';
            showError();
            return;
        }
        if (password.length < 8 || password.length > 24) {
            error = 'Password deve essere tra 8 e 24 caratteri.';
            showError();
            return;
        }
        if (password !== confirmPassword) {
            error = 'Le password non coincidono.';
            showError();
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const data = await response.json();
                error = data.error;
                showError();
            } else {
                window.location.href = '/login';
            }
        } catch (err) {
            console.error('Errore durante la richiesta di registrazione:', err);
            error = 'Errore durante la registrazione. Riprova più tardi.';
            showError();
        }
    }

    function showError() {
        setTimeout(() => {
            error = '';
        }, 3000);
    }
</script>

<div id="sfondo">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title text-center mb-4">Registrazione</h2>
                        {#if error}
                            <div id="error-alert" class="alert alert-danger">{error}</div>
                        {/if}
                        <form on:submit={register}>
                            <div class="form-floating mb-3">
                                <input bind:value={username} type="text" class="form-control" id="username" name="username" placeholder="Username" required>
                                <label for="username">Username</label>
                            </div>
                            <div class="form-floating mb-3" style="position: relative;">
                                <input bind:value={password} type="password" class="form-control" id="password" name="password" placeholder="Password" required>
                                <label for="password">Password</label>
                                <span id="toggle-password" class="password-toggle" on:click={togglePasswordVisibility}>
                                    <i id="password-toggle-icon" class="bi bi-eye-slash-fill"></i>
                                </span>
                            </div>
                            <div class="form-floating mb-3" style="position: relative;">
                                <input bind:value={confirmPassword} type="password" class="form-control" id="confirm-password" name="confirm-password" placeholder="Conferma Password" required>
                                <label for="confirm-password">Conferma Password</label>
                                <span id="toggle-confirm-password" class="password-toggle" on:click={toggleConfirmPasswordVisibility}>
                                    <i id="confirm-password-toggle-icon" class="bi bi-eye-slash-fill"></i>
                                </span>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Registrati</button>
                            </div>
                        </form>
                        <div class="text-center mt-3">
                            <a href="/login" class="btn btn-link">Hai già un account? Accedi</a>
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
