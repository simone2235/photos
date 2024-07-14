
<script>
    import { onMount, afterUpdate } from 'svelte';
    import L from 'leaflet';
  
    let map = null;
    let markers = [];
  
    onMount(() => {
      map = L.map('map').setView([0, 0], 2); 
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      fetchMarkers();
    });
  
    async function fetchMarkers() {
      try {
        const response = await fetch('http://localhost:3000/api/photos-show-map'); 
        const data = await response.json();

        markers.forEach(marker => marker.remove());
        markers = [];
  

        data.forEach(point => {
          const { latitude, longitude } = point;
          const marker = L.marker([latitude, longitude]).addTo(map);
          markers.push(marker);
        });
      } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
      }
    }
  </script>
  
  <style>
    .container-fluid {
      margin-top: 7rem;
     
      display: flex;
      justify-content: center;
      align-items: center;
      
     
    }
  
    #map {
        border: 2px solid rgba(36, 31, 31, 0.325);
      height: 33rem;
     
      border-radius: 3px; 
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.3); 
    }
  
    .greeting {
      font-size: 21px;
      font-weight: bold;
      color: #333;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      margin-bottom: 1rem; 
    }
  </style>
  
  <div class="container-fluid">
    <div class="col text-center">
      <div class="greeting">Qui è  da dove sono state scattate le vostre foto!</div>
      <div id="map"></div>
    </div>
  </div>