class Life{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    show(){
        image(lifeImg, this.x, this.y, this.r, this.r);
    }
}