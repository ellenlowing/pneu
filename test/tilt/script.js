let tfont;
let deviceEnabled=false;
let dmode="draw";
let dimg, dogimg, dsize;
let dcolors=[];
let dprompt="Draw a doodle.";

let rprompt="Tap to change color."
let tapStartT=0;
let tapStarted=false;

function preload() {
  tfont = loadFont('assets/font/NHaasGroteskDSPro-45Lt.otf');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  background(255);
  noFill();
  stroke(0);
  frameRate(60);
  rectMode(CENTER);
  textFont(tfont);
  textSize(48);
  textAlign(CENTER);
  dsize = {w: floor(width*0.6), h: floor(height*0.72)};
  dimg = createImage(dsize.w, dsize.h);
  dcolors=[color(150,103,203),color(107),color(255),color(251,214,49),color(253,151,182),color(242,18,62),color(178,142,76),color(68,124,218),color(116,195,236),color(39,184,110)];
}

function draw() {
  if(dmode==="draw") {
    fill(0);
    text(dprompt, 0, -height/2+50);
    // circle(mouseX, mouseY, 2);
  } else if (dmode==="rotate") {
    background(255);
    fill(0);
    text(rprompt, 0, -height/2+50);
    push();
    rotateZ(-radians(rotationZ));
    rotateX(-radians(rotationX/2));
    rotateY(radians(rotationY));
    texture(dimg);
    rect(0, 50, dsize.w, dsize.h);
    pop();
  }

}

function getDoodle() {
  dmode="rotate";
  dimg=get((windowWidth-dimg.width)/2, (windowHeight-dimg.height)/2, dimg.width, dimg.height);
  dogimg=dimg;
}

function touchStarted() {
  if(dmode==="draw") {
    if( (millis()-tapStartT)<=500 && tapStarted) {
      getDoodle();
      tapStarted=false;
    }
    else if( (millis()-tapStartT)>500 && !tapStarted ) {
      tapStarted=true;
      tapStartT=millis();
    } else {
      tapStarted=false;
    }
  } else if (dmode==="rotate") {
    let dcolor=dcolors[floor(random(dcolors.length))];
    let dcolorimg=createGraphics(dsize.w, dsize.h);
    dcolorimg.background(dcolor);
    dcolorimg.blend(dogimg,0,0,dsize.w,dsize.h,0,0,dsize.w,dsize.h,MULTIPLY);
    dimg=dcolorimg;
  }
}

function touchMoved() {
  if(dmode==="draw") {
    fill(0);
    push();
    translate(-width/2, -height/2);
    line(mouseX, mouseY, pmouseX, pmouseY);
    pop();
  }
  return false;
}

function touchEnded() {
  if(!deviceEnabled) {
    // requestDeviceMotion();
    requestDeviceOrientation();
  }
}

function requestDeviceMotion() {
    // feature detect
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', () => {});
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
    }
  }

function requestDeviceOrientation() {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission()
      .then(permissionState => {
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', () => {});
          deviceEnabled=true;
        }
      })
      .catch(console.error);
  } else {
    // handle regular non iOS 13+ devices
  }
}
