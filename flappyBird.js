var cvs = $("#canvas")[0];
//var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

//load images

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeTop = new Image();
var pipeBottom = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeTop.src = "images/pipeTop.png";
pipeBottom.src = "images/pipeBottom.png";

//variables
var bX = 10;
var bY = 150;
var gap = 85;
var constant;
var gravity = 1.8;
var score = 0;

//audio
var fly = new Audio();
var points = new Audio();

fly.src = "sounds/fly.mp3";
points.src = "sounds/point.mp3";

$(window).on("load", function(){
    $("canvas").hide();
    $("button").click(start);
    $("#point").text("Last score: " + localStorage["pastScore"]);
});

function start(){
    $("canvas").show();
    constant = pipeTop.height + gap;

    $(document).keydown(moveUp);

    function moveUp(e){
        e.preventDefault();
        bY-= 45;
        fly.play();
    }

    //pipe
    var pipe = [];

    pipe[0] = {
        x: cvs.width,
        y: 0 
    }

    function draw(){
        ctx.drawImage(bg, 0, 0);

        for(var i = 0; i < pipe.length; i++){
            ctx.drawImage(pipeTop, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + constant);
            
            pipe[i].x--;

            if(pipe[i].x == 125){
                pipe.push({
                    x: cvs.width,
                    y: Math.floor(Math.random() * pipeTop.height) - pipeTop.height
                });
            }

            //detect collision
            if(bX + bird.width >= pipe[i].x + 1 && bX <= pipe[i].x + pipeTop.width - 1 
                && (bY <= pipe[i].y + pipeTop.height - 5 || bY+bird.height >= pipe[i].y+constant + 5) 
                || bY + bird.height >=  cvs.height - fg.height){
                    localStorage["pastScore"] = score;
                    location.reload();
            }

            if(pipe[i].x == 5){
                score++;
                points.play();
            }
        }
        
        ctx.drawImage(fg, 0, cvs.height - fg.height);

        ctx.drawImage(bird, bX, bY);

        bY += gravity;

        ctx.fillStyle = "#000000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score: " + score, 10, cvs.height - 20);

        requestAnimationFrame(draw);
    }
    draw();
}

