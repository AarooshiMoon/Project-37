//Create variables here
var dog,happyDog;
var database
var foodS, foodStock;
var dogImage,happyDogImage;
var feed, addFood;
var fedTime,lastFed;
var foodObj;
var gameState=0;
var bedroom, garden, washroom;
var sadDog;
var currentTime;

function preload()
{
	//load images here
  //dogImage=loadImage("images/Dog.png");
  happyDogImage=loadImage("images/Happy.png");
  washroom=loadImage("images/Wash Room.png");
  garden=loadImage("images/Garden.png");
  bedroom=loadImage("images/Bed Room.png");
  sadDog=loadImage("images/Dog.png")

}

function setup() {
	createCanvas(1000,500);

  database=firebase.database();
   
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);


  dog=createSprite(800,200,10,10);
  dog.addImage(sadDog);
  dog.scale=0.2;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  foodObj=new Food();
 
}


function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  if(gameState!="Hungry"){
    feed.hide();
    addFood.show();
   // dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  drawSprites();
  
  //add styles here
  textSize(20);
  fill("yellow");
  stroke("black");
  text("Food Remaining : "+ foodS,160,50);


  fill(255,255,254);
  textSize(15);

  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM", 350,30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed: "+ lastFed + "AM", 350,30);
  }

  currentTime=hour();
  if(currentTime==(lastFed+1)){
    updateState("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    updateState("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    updateState("Bathing");
    foodObj.washroom();
  }else{
    updateState("Hungry");
    foodObj.display();
  }
  
  

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);

}

function writeStock(x){
  
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  }
  
  database.ref('/').update({
    Food:x
  })
}

function feedDog(){
  dog.addImage(happyDogImage);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function updateState(state){
  database.ref('/').update({
    gameState:state
  });
}

