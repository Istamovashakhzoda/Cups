/* To apply this animation to your website, paste the following into your HTML code:
<iframe src="https://codepen.io/tommyho/full/abQaRVZ" width=500 height=500></iframe>
*/

/*
  Sources:
  https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/6-physics-libraries/1-matterjs-introduction
  Revised by: tommyho510@gmail.com   
*/

/* --- System Parameters (Recommended)--- */
let pSize =     10;    
let pBorder =   50;   
let pMargin =   10;   
let pDelay =    30;   
let pBounce =   0.8;  
let pFriction = 0.01;
// mouse click in mid-air to create more particles

/* --- Main Program: DO NOT EDIT BELOW --- */
let w = window.innerWidth;
let h = window.innerHeight;

const { Engine, Render, Bodies, World, MouseConstraint, Composites, Query } = Matter;
const sectionTag = document.querySelector("section.canvas");
const engine = Engine.create();
const render = Render.create({
  element: sectionTag,
  engine: engine,
  options: {
    width: w,
    height: h,
    wireframes: false,
    background: "#222",
    pixelRatio: window.devicePixelRatio
  }
});

// Add mouse control
const mouseControl = MouseConstraint.create(engine, {
  element: sectionTag,
  constraint: {
    render: {
      visible: false,
    }
  }
});

// Add a click listener -> add a particle when click
document.addEventListener("click", function(event){
  const shape = createParticleDrip(event.pageX, event.pageY);
  World.add(engine.world, shape);
});

// Add a mousemove listener -> change a particle color and drag a particle
/*
document.addEventListener("mousemove", function(event){
  const vector = {x: event.pageX, y: event.pageY};
  const hoveredParticle = Query.point(particles.bodies, vector);
  
  hoveredParticle.forEach(particle => {
    particle.render.sprite = null
    particle.render.fillStyle = "black"
    particle.render.lineWidth = 5
  });
  
});
*/

// Add static objects
const staticObj1 = Bodies.polygon(w / 2, h / 2, 6, Math.min(w / 4, h / 4), {
  isStatic: true,
  render: {
    // lineWidth: 10,
    fillStyle: "#448",
    visible: true
  }
});

const staticObj2 = Bodies.rectangle(w / 15, h / 2, w / 20, 20, {
  isStatic: true,
  render: {
    // lineWidth: 5,
    fillStyle: "#844",
    visible: true
  }
});

const staticObj3 = Bodies.rectangle(14 * w /15, h / 2, w / 20, 20, {
  isStatic: true,
  render: {
    // lineWidth: 5,
    fillStyle: "#844",
    visible: true
  }
});

const staticObj4 = Bodies.polygon(w / 4 , h / 2, 6, Math.min(w / 8, h / 8), {
  isStatic: true,
  render: {
    fillStyle: "#484",
    visible: true
  }
});

const staticObj5 = Bodies.polygon(3 * w / 4, h / 2, 6, Math.min(w / 8, h / 8), {
  isStatic: true,
  render: {
    fillStyle: "#484",
    visible: true
  }
});

// Add dynamic particles
const particles = Composites.stack(w / 2, pMargin, 1, 1, 40, 40, function(x, y){
  return createParticleDrip(x, y)
});

World.add(engine.world, [
  staticObj1,
  staticObj2,
  staticObj3,
  staticObj4,
  staticObj5,
  particles,
]);

// Define dynamic particle function
function createParticleDrip(x, y) {
  const particle = Bodies.circle(x, y, pSize, {
    frictionAir: pFriction,
    restitution: pBounce,
    render: {
      // fillStyle: "#FFF",
      sprite: {
        yScale: 0.5,
        xScale: 0.5, 
      }
    }
  });
  particle.label = "particle";
  World.add(engine.world, particle);
}

// Define loop
setInterval(() => { 
  const x = Math.random() * (w - 2 * pBorder) + pBorder; 
  const y = pMargin; 
  createParticleDrip(x, y);
}, pDelay); 

setInterval(() => { 
	removeOffScreenParticles();
}, 8000);

function removeOffScreenParticles() {
  const particles = engine.world.bodies.filter(body => body.label === 'particle');
  particles.forEach(particle => {
    if (particle.position.y > render.options.height) {
      World.remove(engine.world, particle);
    }
  });
}

// Start engine
Matter.Engine.run(engine);
Matter.Render.run(render);
