<script>
	import { browser } from "$app/environment";
	import { goto } from "$app/navigation";
	import { logout1 } from "$lib/auth";
    import { isLogged } from "$lib/store";

    if ($isLogged == undefined) {
        goto("/login")
    }


    
</script>



<nav class="navbar bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <a class="navbar-brand" href="/imagine"><i class="bi bi-camera"></i></a>
      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel"><i class="bi bi-menu-up"></i></h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/album">Album <i class="bi bi-journal-album"></i></a>
            </li>
            <li class="nav-item2">
                <a class="nav-link active" aria-current="page" href="/imagine">carica una foto <i class="bi bi-image"></i></a>
            </li>
            <li class="nav-item3">
                <a class="nav-link active" aria-current="page" href="/mymap">controlla sulla mappa<i class="bi bi-compass"></i></a>
            </li>
            <li class="nav-item">
            
              
              <button on:click={logout1} type="button" class="btn btn-outline-primary">Logout</button>
            </li>
            
          </ul>
      
         
        </div>
      </div>
    </div>
  </nav>
<main>
    <slot />
</main>

<style>
    .bi{
        font-size: 1.5rem;
        margin-left: 1rem;
    }
   
   .navbar {
      
        background-color: rgb(26, 94, 251)!important;
        border-bottom: rgba(79, 176, 237, 0.397) 2px solid;
        
    }
    
  
    .offcanvas-header {
        background-color: #f8f9fa; /* Colore di sfondo leggermente più chiaro */
        border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Sottile bordo inferiore */
    }
    .offcanvas-body {
        background-color: #fff; /* Sfondo bianco per il corpo dell'offcanvas */
        
    }
     .btn-outline-primary{
        position: fixed;
    bottom: 20px; /* Distanza dal fondo della pagina */
    right: 20px; /* Distanza dalla destra della pagina */
    }
    .nav-item{
        position: fixed;
    top: 4rem;
    right: 20px; /* Distanza dalla destra della pagina */
    }
    .nav-item2{
        position: fixed;
    top: 6rem;
    right: 20px; /* Distanza dalla destra della pagina */
    }
    .nav-item3{
        position: fixed;
    top: 8rem;
    right: 20px; /* Distanza dalla destra della pagina */
    }


</style>