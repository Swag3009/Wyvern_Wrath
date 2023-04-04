class Hero {
    constructor(){
        this.x = 20;
        this.y = 200;
        this.r = 100
    }

    hit(dragon){
        return collideRectRect(this.x, this.y, this.r, this.r, dragon.x, dragon.y, dragon.r, dragon.r);
    }

    move(userChoice){
        this.y = constrain(this.y, 0, height - this.r);

        if(userChoice === MOUSE){
            this.y = mouseY - 40;
        }else if(userChoice === KEYBOARD){
            if (kb.pressing("ArrowUp")) {
                this.y -= 5;
            }
            if (kb.pressing("ArrowDown")) {
                this.y += 5;
            }
        }
    }

    show(){
        image(mrHeroImg, this.x, this.y, this.r, this.r)
    }
}