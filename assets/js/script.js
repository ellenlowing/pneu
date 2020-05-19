var page = new fullpage('#fullpage', {
  sectionsColor: ['#1bbc9b', '#4BBFC3', '#FAA3BE', 'whitesmoke', '#f9da37'],
  anchors: ['1', '2', '3', '4', '5'],
  menu: '#menu',
  continuousVertical: false,
  afterLoad: function(anchorLink, index){
        // console.log("AFTER LOAD - anchorLink:" +anchorLink + " index:" +index );
    },
    onLeave: function(index, nextIndex, direction){
        // console.log("ONLEAVE - index:" +index + " nextIndex:" +nextIndex  + " direction:" + direction);
    },
});

const colors = ['#FD95B6', '#F47720', '#27B86E', '#89DD76', '#F2123E', '#74C3EC', '#9666CB', '#FBD631'];


function resizeMarquee () {
  let marquee = $('.active .marquee');
  let color = marquee.css('color');
  marquee.css('textShadow', `${color} ${(parseInt(marquee.width()) + 40).toString()}px 0px`);
}

const s3 = p => {
  let theb = null;
  let thebdone = false;
  let flying = 0;
  let balloons = [];
  let face = [];
  let r = 50;
  let bigr;
  let portrait;

  class Balloon {
    constructor(i, c, x, y, pts=[], pg=null) {
      this.i = i;
      this.c = c;
      this.x = x;
      this.y = y;
      this.pts = pts;
    }
    update() {
      this.x += p.map(p.noise(this.x*0.005, this.y*0.005, this.i * 0.1 + flying * 0.001), 0, 1, -2, 2);
      this.y -= 1;
    }
    display() {
      if(this.pg) {
        p.image(this.pg, this.x, this.y);
      } else {
        p.noStroke();
        p.fill(this.c);
        p.ellipse(this.x, this.y, r);
        // if(this.pts.length > 0) {
        //   p.translate(this.x+r/2, this.y+r/2);
        //   p.strokeWeight(2);
        //   p.stroke(0);
        //   for(let i = 0; i < this.pts.length; i++) {
        //     let path = this.pts[i];
        //     for(let j = 0; j < path.length-1; j++) {
        //       let pt = path[j];
        //       let ppt = path[j+1];
        //       p.line(pt.x*r, pt.y*r, ppt.x*r, ppt.y*r);
        //     }
        //   }
        // }
      }
    }

  }


  $('.socialdistancing .okay-btn').click( () => {
    thebdone = true;
    $('.socialdistancing .okay-btn').hide();
    theb.pts = face;
    let pg = p.createGraphics(r, r);
    pg.noStroke();
    pg.fill(theb.c);
    pg.ellipse(r/2, r/2, r);
    if(theb.pts.length > 0) {
      pg.translate(r, r);
      pg.strokeWeight(1);
      pg.stroke(0);
      for(let i = 0; i < theb.pts.length; i++) {
        let path = theb.pts[i];
        for(let j = 0; j < path.length-1; j++) {
          let pt = path[j];
          let ppt = path[j+1];
          pg.line(pt.x*r, pt.y*r, ppt.x*r, ppt.y*r);
        }
      }
    }
    theb.pg = pg;
    p.addExistingBalloon(theb);
    $('.active .marquee').html('Enjoy the party with participants around the world.');
    resizeMarquee();

    // portrait = createGraphics(bigr, bigr);
    // for(let i = 0; i < face.length; i++) {
    //   let tmp = face[i];
    //   for(let j = 0; j < tmp.length-1; j++) {
    //     portrait.line(tmp[j].x, tmp[j].y, tmp[j+1].x, tmp[j+1].y);
    //   }
    // }

  });

  p.addExistingBalloon = (b) => {
    balloons.push(b);
  }

  p.addBalloon = (i, pts=[]) => {
    let c = colors[p.floor(p.random(colors.length))];
    let x = p.random(p.width);
    let y = p.height + r;
    let b = new Balloon(i, c, x, y, pts);
    balloons.push(b);
  }

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    resizeMarquee();
    p.addBalloon();
    bigr = p.height/2;
  }
  p.draw = () => {
    p.background('#ebebeb');
    p.noStroke();
    for(let i = 0; i < balloons.length; i++) {
      let b = balloons[i];
      b.update();
      b.display();
      if(b.y < -r*2) balloons.splice(i, 1);
    }

    if(theb && !thebdone) {
      p.noStroke();
      p.fill(theb.c);
      p.ellipse(p.width/2, p.height/2, bigr);
      p.stroke(0);
      p.strokeWeight(2);
      p.translate(p.width/2+bigr/2, p.height/2+bigr/2);
      if(tempface.length > 0) {
        for(let i = 0; i < tempface.length-1; i++) {
          p.line(tempface[i].x*bigr, tempface[i].y*bigr, tempface[i+1].x*bigr, tempface[i+1].y*bigr);
        }
      }
      for(let i = 0; i < face.length; i++) {
        let tmp = face[i];
        for(let j = 0; j < tmp.length-1; j++) {
          p.line(tmp[j].x*bigr, tmp[j].y*bigr, tmp[j+1].x*bigr, tmp[j+1].y*bigr);
        }
      }
    }

    flying -= 0.01;
    if(p.random(1) < 0.02) p.addBalloon(balloons.length);
  }
  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    resizeMarquee();
  }
  p.mouseClicked = () => {
    if(theb == null && !thebdone) {
      for(let i = 0; i < balloons.length; i++) {
        let b = balloons[i];
        if(p.abs(p.mouseX-b.x) < r/2 && p.abs(p.mouseY-b.y) < r/2) {
          theb = b;
          $('.active .marquee').html('Imagine you are at a house party. Now draw a portrait of yourself at the party.');
          resizeMarquee();
        }
      }
    }
  }
  let tempface = [];
  p.mousePressed = () => {
    if(theb && !thebdone) {
      tempface = [];
      $('.active .okay-btn').show();
    }
  }
  p.mouseDragged = () => {
    if(theb && !thebdone) {
      if(p.abs(p.mouseX-p.width/2) < bigr/2 && p.abs(p.mouseY-p.height/2) < bigr/2) {
        tempface.push(p.createVector((p.mouseX-p.width/2-bigr/2)/bigr, (p.mouseY-p.height/2-bigr/2)/bigr));
      }
    }
  }
  p.mouseReleased = () => {
    if(theb && tempface.length>0 && !thebdone) {
      face.push(tempface);
    }
  }
}

new p5(s3, 'section3');
