<script>
    import { onMount, onDestroy } from "svelte";

    const images = [
        "/src/assets/images/Designer (1).png",
        "/src/assets/images/Designer (2).png",
        "/src/assets/images/Designer (3).png",
        "/src/assets/images/Designer (4).png",
        "/src/assets/images/Designer (5).png",
        "/src/assets/images/Designer (6).png",
        "/src/assets/images/Designer (7).png"
    ];

    let currentIndex = 0; // Start with the first image
    let interval; // Timer reference

    const nextImage = () => {
        currentIndex = (currentIndex + 1) % images.length;
    };

    onMount(() => {
        // Start the carousel
        interval = setInterval(nextImage, 1000); // Change every 3 seconds
    });

    onDestroy(() => {
        // Clean up the interval
        clearInterval(interval);
    });
</script>

<style>
    .carousel {
        position: relative;
        width: 100%;
        height: 250px; /* Adjust the height for better visibility */
        overflow: hidden;
        border-radius: 15px;
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
        margin: 2% auto;
        background: #f9f9f9;
        border: 2px solid #e0e0e0;
    }

    .carousel-inner {
        display: flex;
        transition: transform 0.8s ease-in-out; /* Smooth sliding animation */
    }

    .carousel-item {
        flex: 0 0 100%; /* Each item takes full width */
        height: 100%;
        position: relative;
    }

    .carousel img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Ensure full image is visible */
        border-radius: 15px;
    }

    .floating-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 24px;
        color: #ffffff;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
        font-weight: bold;
        z-index: 10; /* Ensures the text is on top of images */
        animation: circular-motion 6s linear infinite;
        pointer-events: none; /* Allow clicks to go through */
    }

    /* Keyframes for circular motion */
    @keyframes circular-motion {
        0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(100px) rotate(0deg);
        }
        100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(100px) rotate(-360deg);
        }
    }

    /* Controls */
    .controls {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        display: flex;
        justify-content: space-between;
        pointer-events: none;
    }

    .control {
        pointer-events: auto;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        padding: 10px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
    }

    .control:hover {
        background: rgba(0, 0, 0, 0.8);
    }
</style>

<div class="carousel">
    <!-- Floating circular moving text -->
    <div class="floating-text">
        Welcome to My Ecommerce Website. Happy Shopping.
    </div>

    <div
        class="carousel-inner"
        style="transform: translateX(-{currentIndex * 20}%); width: {images.length * 5.7}%"
    >
        {#each images as image}
            <div class="carousel-item">
                <img src={image} alt="Image" />
            </div>
        {/each}
    </div>

    <!-- Controls for navigation -->
    <div class="controls">
        <div class="control" on:click={() => (currentIndex = (currentIndex - 1 + images.length) % images.length)}>
            &#8249;
        </div>
        <div class="control" on:click={() => nextImage()}>
            &#8250;
        </div>
    </div>
</div>
