let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Events = Matter.Events,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Vertices = Matter.Vertices,
    Svg = Matter.Svg,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

// create engine
let engine = Engine.create(),
    world = engine.world;

let width = window.innerWidth;
let height = window.innerHeight;

// create renderer
let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: width,
        height: height,
        pixelRatio: 2,
        showCollisions: false,
        wireframes: false
    }
});

let multiplier = 2;
let density = 0.1;
let colors = ['#fbd630', '#9766ca', '#447ddb', '#f47621', '#fb96b6', '#74c3ec', '#f2123e', '#8bde77', '#27b770'];

Render.run(render);

// create runner
let runner = Runner.create();
Runner.run(runner, engine);

World.add(world, [
    Bodies.rectangle(width/2, -25, width, 50, { isStatic: true }),
    Bodies.rectangle(width/2, height+25, width, 50, { isStatic: true }),
    Bodies.rectangle(width+25, height/2, 50, height, { isStatic: true }),
    Bodies.rectangle(-25, height/2, 50, height, { isStatic: true })
]);

var stack = Composites.stack(0, 0, 9, 4, 10, 10, function(x, y) {
    let color = colors[Math.floor(Math.random() * colors.length)];
    let idx = x < width/2 ? 1 : 2;
    let r = 10;
    return Bodies.circle(x, y, r, { restitution: 1, render: {
      fillStyle: color,
      strokeStyle: color,
      sprite: {
        texture: `./faces/${idx}.png`,
        xScale: r / 40,
        yScale: r / 40
      }
    } });
});

World.add(world, stack);

// add gyro control
let updateGravity = null;
if (typeof window !== 'undefined') {
    updateGravity = function(event) {
        let orientation = typeof window.orientation !== 'undefined' ? window.orientation : 0,
            gravity = engine.world.gravity;
        if (orientation === 0) {
            gravity.x = -Common.clamp(event.gamma, -90, 90) / 90 * multiplier;
            gravity.y = -Common.clamp(event.beta, -90, 90) / 90 * multiplier;
        } else if (orientation === 180) {
            gravity.x = -Common.clamp(event.gamma, -90, 90) / 90 * multiplier;
            gravity.y = -Common.clamp(-event.beta, -90, 90) / 90 * multiplier;
        } else if (orientation === 90) {
            gravity.x = -Common.clamp(event.beta, -90, 90) / 90 * multiplier;
            gravity.y = -Common.clamp(-event.gamma, -90, 90) / 90 * multiplier;
        } else if (orientation === -90) {
            gravity.x = -Common.clamp(-event.beta, -90, 90) / 90 * multiplier;
            gravity.y = -Common.clamp(event.gamma, -90, 90) / 90 * multiplier;
        }
    };
}

$('canvas').bind( 'click touchend', onClick );

function onClick() {
  console.log('clicked')
  shakeScene(engine);
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', updateGravity);
          console.log("adding");
        }
      })
      .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
  }
}

// add mouse control
let mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
          stiffness: 0.2,
          render: {
              visible: false
          }
      }
  });

  // Events.on(engine, 'beforeUpdate', function(event) {
  //     var engine = event.source;
  //
  //     // apply random forces every 5 secs
  //     if (event.timestamp % 5000 < 50)
  //         shakeScene(engine);
  // });

  var shakeScene = function(engine) {
    var bodies = Composite.allBodies(engine.world);

    for (var i = 0; i < bodies.length; i++) {
        var body = bodies[i];

        if (!body.isStatic) {
            var forceMagnitude = 0.001 * body.mass;

            Body.applyForce(body, body.position, {
                x: (forceMagnitude + Common.random() * forceMagnitude) * Common.choose([1, -1]),
                y: -forceMagnitude
            });
        }
    }
};

setInterval(() => shakeScene(engine), 1);

World.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;
