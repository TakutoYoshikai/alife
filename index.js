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

  }
  this.femaleGene = {

  }
  this.sharedGene = {

  }
  this.conbination = function() {
    return [];
  }
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
function Human(gender, position) { this.gene = new Gene(); this.gender = gender;
  this.direction = makeRandomDirection();
  this.position = position;
  this.power = 50;
  if (gender == Gender.female) {
    this.power = 30;
  }

  this.moveOrChangeDirection = function() {
    var isMove = Math.floor(Math.random() * 100);
    if (isMove > 60) {
      this.move();
    } else {
      this.changeDirection();
    }
  }

  this.changeDirection = function() {
    var isLeft = Math.floor(Math.random() * 2);
    if (this.direction.x == -1 && this.direction.y == -1) {
      if (isLeft) {
        this.direction.y = 0;
      } else {
        this.direction.x = 0;
      }
      return;
    }

    if (this.direction.x == -1 && this.direction.y == 0) {
      if (isLeft) {
        this.direction.y = 1;
      } else {
        this.direction.y = -1;
      }
      return;
    }
    if (this.direction.x == -1 && this.direction.y == 1) {
      if (isLeft) {
        this.direction.x = 0;
      } else {
        this.direction.y = 0;
      }
      return;
    }
    if (this.direction.x == 0 && this.direction.y == -1) {
      if (isLeft) {
        this.direction.x = -1;
      } else {
        this.direction.x = 1;
      }
      return;
    }
    if (this.direction.x == 0 && this.direction.y == 1) {
      if (isLeft) {
        this.direction.x = 1;
      } else {
        this.direction.x = -1;
      }
      return;
    }
    if (this.direction.x == 1 && this.direction.y == -1) {
      if (isLeft) {
        this.direction.x = 0;
      } else {
        this.direction.y = 0;
      }
      return;
    }
    if (this.direction.x == 1 && this.direction.y == 0) {
      if (isLeft) {
        this.direction.y = -1;
      } else {
        this.direction.y = 1;
      }
      return;
    }
    if (this.direction.x == 1 && this.direction.y == 1) {
      if (isLeft) {
        this.direction.y = 0;
      } else {
        this.direction.x = 0;
      }
      return;
    }
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

function Beast(position) {
  this.direction = makeRandomDirection();
  this.position = position;
  this.power = 60;
  this.moveOrChangeDirection = function() {
    for (var step = 1; step < 10; step++) {
      var sight = map[this.position.y + (this.direction.y * step)][this.position.y + (this.direction.x * step)];
      if (sight == LifeTypes.male || sight == LifeTypes.female) {
        this.move();
        return;
      }
    }
    this.changeDirection();
  }
  this.move = function() {
    var x = this.position.x + this.direction.x;
    var y = this.position.y + this.direction.y;
    if (map[y][x] == LifeTypes.male || map[y][x] == LifeTypes.female) {
      var human = findHuman(x, y);
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
    }
  }
  this.changeDirection = function() {
    var isLeft = Math.floor(Math.random() * 2);
    if (this.direction.x == -1 && this.direction.y == -1) {
      if (isLeft) {
        this.direction.y = 0;
      } else {
        this.direction.x = 0;
      }
      return;
    }

    if (this.direction.x == -1 && this.direction.y == 0) {
      if (isLeft) {
        this.direction.y = 1;
      } else {
        this.direction.y = -1;
      }
      return;
    }
    if (this.direction.x == -1 && this.direction.y == 1) {
      if (isLeft) {
        this.direction.x = 0;
      } else {
        this.direction.y = 0;
      }
      return;
    }
    if (this.direction.x == 0 && this.direction.y == -1) {
      if (isLeft) {
        this.direction.x = -1;
      } else {
        this.direction.x = 1;
      }
      return;
    }
    if (this.direction.x == 0 && this.direction.y == 1) {
      if (isLeft) {
        this.direction.x = 1;
      } else {
        this.direction.x = -1;
      }
      return;
    }
    if (this.direction.x == 1 && this.direction.y == -1) {
      if (isLeft) {
        this.direction.x = 0;
      } else {
        this.direction.y = 0;
      }
      return;
    }
    if (this.direction.x == 1 && this.direction.y == 0) {
      if (isLeft) {
        this.direction.y = -1;
      } else {
        this.direction.y = 1;
      }
      return;
    }
    if (this.direction.x == 1 && this.direction.y == 1) {
      if (isLeft) {
        this.direction.y = 0;
      } else {
        this.direction.x = 0;
      }
      return;
    }
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
      map[i].push(0);
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
  var malesNum = 20;
  var femalesNum = 20;
  var beastsNum = 5;
  var plantsNum = 40;
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

  for (var i = 0; i < plantsNum; i++) {
    var position = makeRandomPosition();  
    map[position.y][position.x] = LifeTypes.plants;
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

function update() {
}
  