let dots;
let sqares;

function setup() {
    new Canvas(800, 400);
    dots = new Group();
	dots.color = 'yellow';
	dots.y = () => random(0, height/2);
	dots.diameter = 10;
	
	while (dots.length < 24) {
		let dot = new dots.Sprite();
		dot.x = dots.length * 20;
	}

    sqares = new Group();
	sqares.color = 'green';
	sqares.y = () => random(height/2, height);
	sqares.diameter = 10;
	
	while (sqares.length < 24) {
		let dot = new sqares.Sprite();
		dot.x = sqares.length * 20;
	}
    dots.vel.x =  0
    dots.vel.y = 2
    sqares.vel.x =  0
    sqares.vel.y = -2
    console.log(dots)
}

function draw() {
    background(220); // try removing this line and see what happens!

    dots.collides(sqares, (sprite1, sprite2) => {
        console.log(sprite2)
        sprite1.remove()
        sprite2.remove()
    })
}
