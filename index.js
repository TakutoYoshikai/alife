var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = 200;
var height = 200;

var LifeTypes = {
  nothing: 0,
  male: 1,
  female: 2,
  beast: 3,
  plant: 4
}

var Gender = {
  male: 1,
  female: 2
}

function Gene() {
  this.maleGene = {
    courage: 1.0,
    kindness: 0.7,
    power: 1.0
  }
  this.femaleGene = {
    guard: 0.5,
    power: 0.5
  }
  this.sharedGene = {
    sexual: 1.0,
    survivalInstinct: 1.0,
  }
  this.conbination = function() {
    return [];
  }
}

function makeRandomGene() {
  var gene = new Gene();
  gene.maleGene.courage = Math.random();
  gene.maleGene.kindness = Math.random();
  gene.maleGene.power = Math.random() * 0.5 + 0.5;
  gene.sharedGene.sexual = Math.random();
  gene.femaleGene.guard = Math.random();
  gene.maleGene.power = Math.random() * 0.3 + 0.3;
  return gene;
}
function makeRandomDirection() {
  var randX = Math.floor(Math.random() * 2);
  var randY = Math.floor(Math.random() * 2);
  var x, y;
  if (randX == 0) {
    x = -1;
  } else {
    x = 1;
  }

  if (randY == 0) {
    y = -1;
  } else {
    y = 1;
  }
  return { x: x, y: y };
}

function countAround(life, lifeTypes) {
  var minX = Math.max(0, life.position.x - 1);
  var maxX = Math.min(width - 1, life.position.x + 1);
  var minY = Math.max(0, life.position.y - 1);
  var maxY = Math.min(height - 1, life.position.y + 1);
  var count = 0;
  for (var i = minY; i <= maxY; i++) {
    for (var j = minX; j <= maxX; j++) {
      if (i == life.position.y && j == life.position.x) {
        continue;
      }
      if (lifeTypes.includes(map[i][j])) {
        count++;
      }
    }
  }
  return count;
  
}
function isOutSide(position, direction) {
  if (position.y + direction.y < 0 || position.y + direction.y >= height || position.x + direction.x < 0 || position.x + direction.x >= width) {
    return true;
  }
  return false;
}
function Human(gender, position) { 
  this.gene = makeRandomGene(); 
  this.gender = gender;
  this.direction = makeRandomDirection();
  this.position = position;
  this.hp = 70;
  this.eyeSight = 5;
  this.babiesInPain = 0;
  this.age = 0;
  this.power = function() {
    if (this.gender == Gender.male) {
      return this.gene.maleGene.power;
    }
    return this.gene.femaleGene.power;
  }

  this.update = function() {
    this.age += 1;
    this.hp -= 1;
    if (this.hp <= 0 || countAround(this, [LifeTypes.male, LifeTypes.female]) > 5) {
      this.die();
      return;
    }
    if (!isOutSide(this.position, this.direction) && this.babiesInPain > 0 && Math.random() < 0.2 && map[this.position.y + this.direction.y][this.position.x + this.direction.x] == LifeTypes.nothing) {
      var isMale = Math.floor(Math.random() * 2);
      var baby;
      if (isMale) {
        baby = new Human(Gender.male, { x: this.position.x + this.direction.x, y: this.position.y + this.direction.y });
      } else {
        baby = new Human(Gender.female, { x: this.position.x + this.direction.x, y: this.position.y + this.direction.y });
      }
      humen.push(baby);
      map[baby.position.y][baby.position.x] = baby.gender;
      this.babiesInPain--;
      return;
    }
    this.moveOrChangeDirection();
  }
  this.die = function() {
    map[this.position.y][this.position.x] = LifeTypes.nothing;
    var human = findHumanAndIndex(this.position.x, this.position.y);
    if (human != null) {
      humen.splice(human.index, 1);
    }
  }

  this.sight = function() {
    return sight(this.position, this.direction, this.eyeSight);
  }

  this.isChild = function() {
    return this.age <= 16;
  }

  this.moveOrChangeDirection = function() {
    if (this.isChild()) {
      var isMove = Math.floor(Math.random() * 100);
      if (isMove > 60) {
        this.move();
      } else {
        this.changeDirection();
      }
      return;
    }
    var sight = this.sight();
    var femaleDirection = around(this, LifeTypes.female);

    if (femaleDirection != null) {
      var female = findHumanAndIndex(this.position.x + femaleDirection.x, this.position.y + femaleDirection.y).target;
      if (!female.isChild() && female.babiesInPain == 0) {
        female.babiesInPain += Math.floor(Math.random() * 3);
        this.gene.maleGene.courage += 0.3;
      }
    }

    if (this.gender == Gender.male && sight.includes(LifeTypes.female)) {
      if (sight.includes(LifeTypes.beast) && this.gene.sharedGene.sexual < 1 - this.gene.maleGene.courage) {
        this.direction.x *= -1;
        this.direction.y *= -1;
        this.move();
        return;
      }
      if (Math.random() <= this.gene.sharedGene.sexual) {
        this.move();
        return;
      }
    }
    var beastDirection = around(this, LifeTypes.beast);
    if (this.gender == Gender.male && beastDirection != null) {
      if (this.gene.maleGene.courage > this.gene.sharedGene.survivalInstinct) {
        this.direction = beastDirection;
        this.move();
        return;
      }
    }
    if (this.gender == Gender.female && sight.includes(LifeTypes.male)) {
      if (sight.includes(LifeTypes.beast)) {
        if (Math.random() <= this.gene.sharedGene.survivalInstinct) {
          this.direction.x *= -1;
          this.direction.y *= -1;
          this.move();
          return;
        }
      }
      if (Math.random() <= this.gene.sharedGene.sexual * 0.4) {
        this.move();
        return;
      }
    }
    var isMove = Math.floor(Math.random() * 100);
    if (isMove > 60) {
      this.move();
    } else {
      this.changeDirection();
    }
  }
  this.move = function() {
    if (isOutSide(this.position, this.direction)) {
      return;
    }
    var x = this.position.x + this.direction.x;
    var y = this.position.y + this.direction.y;
    if (map[y][x] == LifeTypes.nothing) {
      map[this.position.y][this.position.x] = LifeTypes.nothing;
      this.position.x = x;
      this.position.y = y;
      map[y][x] = this.gender;
      return;
    }

    if (map[y][x] == LifeTypes.plant) {
      map[this.position.y][this.position.x] = LifeTypes.nothing;
      this.position.x = x;
      this.position.y = y;
      map[y][x] = this.gender;
      this.hp += 5;
      return;
    }

    if ((this.gender == Gender.male && map[y][x] == LifeTypes.female) || (this.gender == Gender.female && map[y][x] == LifeTypes.male)) {

      return;
    }

    if (map[y][x] == LifeTypes.beast) {
      var beast = findBeastAndIndex(x, y);
      if (beast == null) {
        map[this.position.y][this.position.x] = LifeTypes.nothing;
        map[y][x] = this.gender;
        this.position.x = x;
        this.position.y = y;
        return;
      }
      var beastIndex = beast.index;
      beast = beast.target;
      if (this.power() > beast.power) {
        beast.splice(beastIndex, 1);
        map[this.position.y][this.position.x] = LifeTypes.nothing;
        map[y][x] = this.gender;
        this.position.x = x;
        this.position.y = y;
      } else {
        var humanIndex = humen.indexOf(this);
        if (humanIndex == -1) {
          return;
        }
        map[this.position.y][this.position.x] = LifeTypes.nothing;
        humen.splice(humanIndex, 1);
      }
    }  
  }

  this.changeDirection = function() {
    changeDirection(this);
  }
}

function findHumanAndIndex(x, y) {
  for (var i = 0; i < humen.length; i++) {
    if (humen[i].position.x == x && humen[i].position.y == y) {
      return { target: humen[i], index: i }
    }
  }
  return null;
}

function findBeastAndIndex(x, y) {
  for (var i = 0; i < beasts.length; i++) {
    if (beasts[i].position.x == x && beasts[i].position.y == y) {
      return { target: beasts[i], index: i }
    }
  }
  return null;
  
}

function around(life, targetType) {
  var minX = Math.max(0, life.position.x - 1);
  var maxX = Math.min(width - 1, life.position.x + 1);
  var minY = Math.max(0, life.position.y - 1);
  var maxY = Math.min(height - 1, life.position.y + 1);
  for (var i = minY; i <= maxY; i++) {
    for (var j = minX; j <= maxX; j++) {
      if (i == life.position.y && j == life.position.x) {
        continue;
      }
      if (map[i][j] == targetType) {
        return {
          x: j - life.position.x,
          y: i - life.position.y
        }
      }
    }
  }
  return null;
}

function sight(position, direction, eyeSight) {
  var result = [];
  if (Math.abs(direction.x) + Math.abs(direction.y) == 1) {
    for (var step = 1; step < eyeSight; step++) {
      if (Math.abs(direction.x) == 1) {
        var sightX = position.x + (direction.x * step);
        if (sightX < 0 || sightX >= width) {
          break;
        }
        var sightMinY = Math.max(0, position.y - step);
        var sightMaxY = Math.min(height - 1, position.y + step);
        for (var y = sightMinY; y <= sightMaxY; y++) {
          if (map[y][sightX] != LifeTypes.nothing) {
            result.push(map[y][sightX]);
          }
        }
      } else if (Math.abs(direction.y) == 1) {
        var sightY = position.y + (direction.y * step);
        if (sightY < 0 || sightY >= height) {
          break;
        }
        var sightMinX = Math.max(0, position.x - step);
        var sightMaxX = Math.min(width - 1, position.x + step);
        for (var x = sightMinX; x <= sightMaxX; x++) {
          if (map[sightY][x] != LifeTypes.nothing) {
            result.push(map[sightY][x]);
          }
        }
      }
    }
  } 
  return result;
}

function changeDirection(life) {
  var isLeft = Math.floor(Math.random() * 2);
  if (life.direction.x == -1 && life.direction.y == -1) {
    if (isLeft) {
      life.direction.y = 0;
    } else {
      life.direction.x = 0;
    }
    return;
  }

  if (life.direction.x == -1 && life.direction.y == 0) {
    if (isLeft) {
      life.direction.y = 1;
    } else {
      life.direction.y = -1;
    }
    return;
  }
  if (life.direction.x == -1 && life.direction.y == 1) {
    if (isLeft) {
      life.direction.x = 0;
    } else {
      life.direction.y = 0;
    }
    return;
  }
  if (life.direction.x == 0 && life.direction.y == -1) {
    if (isLeft) {
      life.direction.x = -1;
    } else {
      life.direction.x = 1;
    }
    return;
  }
  if (life.direction.x == 0 && life.direction.y == 1) {
    if (isLeft) {
      life.direction.x = 1;
    } else {
      life.direction.x = -1;
    }
    return;
  }
  if (life.direction.x == 1 && life.direction.y == -1) {
    if (isLeft) {
      life.direction.x = 0;
    } else {
      life.direction.y = 0;
    }
    return;
  }
  if (life.direction.x == 1 && life.direction.y == 0) {
    if (isLeft) {
      life.direction.y = -1;
    } else {
      life.direction.y = 1;
    }
    return;
  }
  if (life.direction.x == 1 && life.direction.y == 1) {
    if (isLeft) {
      life.direction.y = 0;
    } else {
      life.direction.x = 0;
    }
    return;
  }
}


function Beast(position) {
  this.direction = makeRandomDirection();
  this.position = position;
  this.power = 60;
  this.hp = 20;
  this.update = function() {
    this.moveOrChangeDirection();
  }

  this.sight = function() {
    return sight(this.position, this.direction, 20);   
  }
  this.moveOrChangeDirection = function() {
    direction = around(this, LifeTypes.male);
    if (direction != null) {
      this.direction = direction;
    }
    var direction = around(this, LifeTypes.female);
    if (direction != null) {
      this.direction = direction;
    }
    var sight = this.sight()
    if (sight.includes(LifeTypes.male) || sight.includes(LifeTypes.female)) {
      this.move();
      return;
    }

    var isMove = Math.floor(Math.random() * 100);
    if (isMove > 60) {
      this.move();
    } else {
      this.changeDirection();
    }
  }
  this.move = function() {
    if (isOutSide(this.position, this.direction)) {
      return;
    }
    var x = this.position.x + this.direction.x;
    var y = this.position.y + this.direction.y;
    if (map[y][x] == LifeTypes.male || map[y][x] == LifeTypes.female) {
      var human = findHumanAndIndex(x, y);
      if (human == null) {
        map[this.position.y][this.position.x] = LifeTypes.nothing;
        map[y][x] = LifeTypes.beast;
        this.position.x = x;
        this.position.y = y;
        return;
      }
      var humanIndex = human.index;
      human = human.target;
      if (this.power > human.power) {
        humen.splice(humanIndex, 1);
        map[this.position.y][this.position.x] = LifeTypes.nothing;
        map[y][x] = LifeTypes.beast;
        this.position.x = x;
        this.position.y = y;
      } else {
        var beastIndex = beasts.indexOf(this);
        if (beastIndex == -1) {
          return;
        }
        map[this.position.y][this.position.x] = LifeTypes.nothing;
        beasts.splice(beastIndex, 1);
      }
    } else if (map[y][x] == LifeTypes.nothing || map[y][x] == LifeTypes.plant) {
        map[this.position.y][this.position.x] = LifeTypes.nothing;
        map[y][x] = LifeTypes.beast;
        this.position.x = x;
        this.position.y = y;
    }
  }
  this.changeDirection = function() {
    changeDirection(this);
  }
}


var map = [];
var humen = [];
var beasts = [];

function init() {
  map = [];
  for (var i = 0; i < 200; i++) {
    map.push([]);
    for (var j = 0; j < 200; j++) {
      map[i].push(LifeTypes.nothing);
    }
  }

  humen = [];
  beasts = [];

  makeSeeds();
}

function makeRandomPosition() {
  var x = Math.floor(Math.random() * width);
  var y = Math.floor(Math.random() * height);
  return {
    x: x,
    y: y
  }
}
function makeSeeds() {
  var malesNum = 50;
  var femalesNum = 50;
  var beastsNum = 50;
  var plantsNum = 2000;

  for (var i = 0; i < plantsNum; i++) {
    var position = makeRandomPosition();  
    map[position.y][position.x] = LifeTypes.plant;
  }
  for (var i = 0; i < malesNum; i++) {
    var position = makeRandomPosition();  
    map[position.y][position.x] = LifeTypes.male;
  }

  for (var i = 0; i < femalesNum; i++) {
    var position = makeRandomPosition();  
    map[position.y][position.x] = LifeTypes.female;
  }
  for (var i = 0; i < beastsNum; i++) {
    var position = makeRandomPosition();  
    map[position.y][position.x] = LifeTypes.beast;
  }


  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var life = map[i][j];
      var position = { x: j, y: i };
      if (life == LifeTypes.male) {
        humen.push(new Human(Gender.male, position));
      }
      if (life == LifeTypes.female) {
        humen.push(new Human(Gender.female, position));
      }
      if (life == LifeTypes.beast) {
        beasts.push(new Beast(position));
      }
    }
  }

}

function drawMap() {
  context.beginPath();
  context.fillStyle = "white";
  context.fillRect(0, 0, 1000, 1000);
  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var life = map[i][j];
      context.beginPath();
      if (life == LifeTypes.male) {
        context.fillStyle = "blue";
      }
      if (life == LifeTypes.female) {
        context.fillStyle = "red";
      }
      if (life == LifeTypes.beast) {
        context.fillStyle = "brown";
      }
      if (life == LifeTypes.plant) {
        context.fillStyle = "green";
      }
      if (life == LifeTypes.nothing) {
        context.fillStyle = "white";
      }
      context.fillRect(5 * j, 5 * i, 5, 5);

    }
  }
}
function update() {
  beasts.forEach(function(beast) {
    beast.update();
  });
  humen.forEach(function(human) {
    human.update();
  });

  drawMap();
}
  
init();
setInterval(update, 500);
