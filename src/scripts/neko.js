class VirtualPet {
  constructor() {
    this.animations = [
      "sleeping",
      "scratchSelf",
      "lickPaw",
      "scratchWallW",
      "scratchWallN",
      "scratchWallE",
      "scratchWallS"
    ];
    this.currentAnimation = this.getRandomAnimation();

    // Create a visual pet element
    this.petElement = document.createElement('div');
    this.petElement.style.position = 'absolute';
    this.petElement.style.width = '50px';
    this.petElement.style.height = '50px';
    this.petElement.style.backgroundColor = 'blue'; // Just as a placeholder for the pet
    document.body.appendChild(this.petElement);

    // Attach click event listener
    document.addEventListener('click', (event) => this.onClick(event));
  }

  getRandomAnimation() {
    return this.animations[Math.floor(Math.random() * this.animations.length)];
  }

  update() {
    this.currentAnimation = this.getRandomAnimation(); // Always switch to a new animation
    this.playAnimation(this.currentAnimation);
  }

  playAnimation(animation) {
    console.log(`Playing animation: ${animation}`);
    // Insert actual animation-playing logic here
  }

  onClick(event) {
    // Get the mouse coordinates where the click happened
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Trigger the pet to move to the clicked position
    console.log(`Pet is moving to: (${mouseX}, ${mouseY})`);
    
    this.petElement.style.left = `${mouseX - 25}px`;  // Center the pet on the click (50px width)
    this.petElement.style.top = `${mouseY - 25}px`;   // Center the pet on the click (50px height)
    
    this.update(); // Update the pet's animation
  }
}

// Initialize the virtual pet
const pet = new VirtualPet();
