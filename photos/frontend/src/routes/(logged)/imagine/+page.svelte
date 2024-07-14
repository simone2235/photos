<script>
	import { isLogged } from '$lib/store';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	let photo = '';
	let title = '';
	let description = '';
	let latitude = '';
	let longitude = '';
	let message = '';
	let photos = [];

	let form;

	async function handleSubmit(event) {
			event.preventDefault();

			if (!isValidDecimal(latitude) || !isValidDecimal(longitude)) {
					return alert('Inserisci numeri decimali validi per latitudine e longitudine.');
			}

			const formData = new FormData();
			formData.append("photo", photo);
			formData.append("title", title)
			formData.append("description", description)
			formData.append("latitude", latitude)
			formData.append("longitude", longitude)

			try {
					const response = await fetch('http://localhost:3000/api/photos', {
							method: 'POST',
							headers: { 'token': $isLogged },
							body: formData
					});

					if (!response.ok) {
							throw new Error('Errore durante il salvataggio della foto.');
					}

					title = '';
					description = '';
					latitude = '';
					longitude = '';

					message = 'Foto salvata con successo!';
					setTimeout(() => {
							message = ''; 
					}, 3000);

					await loadPhotos();

			} catch (error) {
					console.error('Errore:', error.message);

					message = 'Errore durante il salvataggio della foto.';
					setTimeout(() => {
							message = ''; 
					}, 3000);
			}
	}

	function handleDescriptionInput(event) {
			
			if (event.target.value.length > 200) {
					event.target.value = event.target.value.slice(0, 200);
			}
			description = event.target.value;
	}

	async function loadPhotos() {
			try {
					const response = await fetch('http://localhost:3000/api/photos', {
						headers: { 'token': $isLogged },
					});
					if (!response.ok) {
							throw new Error('Errore durante il recupero delle foto.');
					}
					const data = await response.json();
					photos = data.photos; 
			} catch (error) {
					console.error('Errore durante il recupero delle foto:', error.message);
			}
	}

	function isValidDecimal(value) {
			
			return /^-?\d{0,30}(\.\d{1,30})?$/.test(value);
	}

	function handleUploadImage(event) {
			photo = event.target.files[0]
	}

	// Carica le foto al caricamento del componente
	onMount(loadPhotos);

	let userName = '';

	onMount(() => {
	const storedToken = localStorage.getItem('logged');
	if (storedToken) {
		try {
			const decodedToken = parseJwt(storedToken);
			userName = decodedToken.username;
		} catch (error) {
			console.error('Errore nella decodifica del token:', error);
		}
	}
	});

	// Funzione per decodificare il token JWT
	function parseJwt(token) {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		return JSON.parse(atob(base64));
	} catch (error) {
		throw new Error('Token JWT non valido');
	}
	}
</script>

<div class="container mt-5">
	<h2> <strong>{userName}</strong> Carica una Foto e controlla la Galleria</h2>

	<!-- Mostra il messaggio di successo o di errore -->
	{#if message}
			<div class="alert alert-success" role="alert" style="margin-bottom: 10px;">
					{message}
			</div>
	{/if}

	<form bind:this={form} on:submit|preventDefault={handleSubmit}>
			<div class="form-group">
					<label for="photo">Carica Foto</label>
					<input type="file" id="photo" on:change={handleUploadImage} required>
			</div>
			<div class="form-group">
					<label for="title">Titolo (max 20 caratteri)</label>
					<input type="text" id="title" bind:value={title} maxlength="20" required>
			</div>
			<div class="form-group">
					<label for="description">Descrizione (max 200 caratteri)</label>
					<textarea id="description" bind:value={description} on:input={handleDescriptionInput} rows="3" required></textarea>
					<small class="form-text">Caratteri rimanenti: {200 - description.length}</small>
			</div>
			<div class="form-group">
					<label for="latitude">Latitudine</label>
					<input type="text" id="latitude" bind:value={latitude} maxlength="30" required>
			</div>
			<div class="form-group">
					<label for="longitude">Longitudine</label>
					<input type="text" id="longitude" bind:value={longitude} maxlength="30" required>
			</div>
			<button type="submit">Salva Foto</button>
	</form>

	<hr>

	<!-- Carosello per la galleria di foto -->
	<div class="carousel-container">
			<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
					<div class="carousel-inner">
							{#each photos as photo, index}
									<div class="carousel-item {index === 0 ? 'active' : ''}">
											<img class="d-block w-100" src={photo} alt="photo {index}">
									</div>
							{/each}
					</div>
					<a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
							<span class="carousel-control-prev-icon" aria-hidden="true"></span>
							<span class="sr-only">Previous</span>
					</a>
					<a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
							<span class="carousel-control-next-icon" aria-hidden="true"></span>
							<span class="sr-only">Next</span>
					</a>
			</div>
	</div>
</div>

<style>
	.container {
		margin-top: 6rem!important;
			padding: 20px;
			
			border: 1px solid #ccc;
			border-radius: 10px;
			background-color: #f9f9f9;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.form-group {
			margin-bottom: 20px;
	}

	label {
			font-weight: bold;
			margin-bottom: 5px;
			display: block;
	}

	input[type="file"],
	input[type="text"],
	textarea {
			width: 100%;
			padding: 10px;
			border: 1px solid #ccc;
			border-radius: 5px;
			font-size: 16px;
			margin-top: 5px;
	}

	textarea {
			resize: vertical;
	}

	.form-text {
			font-size: 14px;
			color: #666;
			display: block;
			margin-top: 5px;
	}

	button[type="submit"] {
			padding: 10px 20px;
			background-color: #007bff;
			border: none;
			color: white;
			border-radius: 5px;
			cursor: pointer;
			font-size: 16px;
			transition: background-color 0.3s ease;
			margin-top: 10px;
	}

	button[type="submit"]:hover {
			background-color: #0056b3;
	}

	hr {
			border-top: 1px solid #ccc;
			margin-top: 40px;
			margin-bottom: 40px;
	}

	.carousel-container {
			border: 1px solid #ccc;
			border-radius: 10px;
			margin-top: 20px;
			padding: 20px;
			background-color: #ffffff;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
</style>
