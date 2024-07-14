<script>
    import { onMount } from 'svelte';
    let images = [];
    let totalImages = 0;
    let selectedImage = null; 
    
    function openModal(image) {
      selectedImage = image;
    }
  
    function closeModal() {
      selectedImage = null;
    }
  
    onMount(async () => {
      const res = await fetch('http://localhost:3000/api/images');
      images = await res.json();
      totalImages = images.length;
    });
  
 


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
  
  <style>
    .album-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
  
    .album-title {
      font-size: 2em;
      margin-bottom: 20px;
      margin-top: 5rem;
    }
  
    .album {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  
    .album img {
      margin: 10px;
      width: 200px;
      height: auto;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
    }
  
    .album img:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
  
    .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 1000;
    }
  
    .modal img {
      max-width: 90%;
      max-height: 90%;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    }
  
    .modal-close {
      position: fixed;
      top: 20px;
      right: 20px;
      font-size: 2em;
      color: white;
      cursor: pointer;
    }
  </style>
  
  <div class="album-container">
    <h1 class="album-title"><strong>{userName}</strong> questa è la raccolta dei nostri Utenti </h1>
    
    <p>grazie a voi abbiamo raggiunto ben {totalImages}  foto!</p>
    <div class="album">
      {#each images as image}
        <img src={`http://localhost:3000/public/${image}`} alt={image} on:click={() => openModal(image)} />
      {/each}
    </div>
  </div>
  
  {#if selectedImage}
    <div class="modal" on:click={closeModal}>
      <img src={`http://localhost:3000/public/${selectedImage}`} alt={selectedImage} />
      <span class="modal-close" on:click={closeModal}>&times;</span>
    </div>
  {/if}
  