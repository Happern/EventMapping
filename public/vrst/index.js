AFRAME.registerGeometry('triangularPanel', {
  schema: {
    height: {
      "default": 10
    },
    width: {
      "default": 4
    },
    depth: {
      "default": 0
    },
    reverse: {
      "default": false
    }//,
    /*vetices: {
    "default": [{x:0,y;0,z:0},{x:0,y;1,z:0}, {x:0, y: 0, z: 1}]
  },*/
},
init: function (data) {
  var geometry = new THREE.Geometry();

  var vertexCoordinates = [];
  if (data.reverse) {
    vertexCoordinates.push({
      x: 0,
      y: 0,
      z: 0
    });
    vertexCoordinates.push({
      x: - data.width,
      y: data.height,
      z: 0
    });
    vertexCoordinates.push({
      x: - data.width,
      y: 0,
      z: data.depth
    });
  } else {
    vertexCoordinates.push({
      x: data.width,
      y: 0,
      z: 0
    });
    vertexCoordinates.push({
      x: data.width,
      y: data.height,
      z: 0
    });
    vertexCoordinates.push({
      x: 0,
      y: data.height,
      z: 0
    });
  }

  geometry.vertices.push.apply(
    geometry.vertices, getVerticesFromCoordinates(vertexCoordinates)
  );

  var face = new THREE.Face3(0,1,2);

  geometry.faces.push(face);

  this.geometry = geometry;
}
});

function getVerticesFromCoordinates (vertices) {
  return vertices.map(function (vertex) {
    return new THREE.Vector3(vertex.x, vertex.y, vertex.z)
  });
}



$(document).ready(function () {
  var numLayers = 8;
  var radius = 100;
  var radiusInc = 20;
  var yCoord = -40;
  var yInc = 40;
  var panelInc = 5;

  var numPanels = 50;
  var width = 20;
  var height = 40;

  for (var layerInd = 0; layerInd < numLayers; layerInd++) {
    initVerticesLayer({x: 0, y:yCoord, z:0}, numPanels, radius-2, true, true, false, width, height, 0);
    initVerticesLayer({x: 0, y:yCoord, z:0}, numPanels, radius, false, false, true, width, height, 0);
    radius += radiusInc;
    yCoord += yInc;
    numPanels += panelInc;
  }
});

function initVerticesLayer(layerCenter, numPanels, radius, isTransparent, isMoving, isReverse, width, height, depth) {
  var sceneElement = $("#scene");
  var angleGap = (2 * Math.PI) / numPanels;

  var positions = [];
  var rotations = [];

  for (var angle = 0; angle< (2 * Math.PI); angle += angleGap) {
    var panelPosition = getXZCoords(angle, radius);
    var positionMod = {x: panelPosition.x + layerCenter.x, y: layerCenter.y, z: panelPosition.z + layerCenter.z};
    positions.push(positionMod);


    var angleMod = 270 - (angle / (2 * Math.PI) * 360); //convert to degrees and subtract from 90

    /*if (!isReverse) {
    angleMod = - (angle / (2 * Math.PI) * 360) + 90;
  }*/

  //var angleMod = 0;
  rotations.push({x: 0, z:0, y: angleMod});
}

var numPositions = positions.length;

for (var posIndex = 0; posIndex < numPositions; posIndex++) {
  var original = positions[posIndex];
  var rot = rotations[posIndex];
  var nextPositions = [original];
  var nextRotations = [rot];
  nextPositions = nextPositions.concat(positions.slice(posIndex, numPositions).concat(positions.slice(0, posIndex)));
  nextRotations = nextRotations.concat(rotations.slice(posIndex, numPositions).concat(rotations.slice(0, posIndex)));
  //    console.log(nextPositions);
  var panelElement = getPanelElement(original, rot, nextPositions, nextRotations, isTransparent, isMoving, isReverse, width, height, depth);
  sceneElement.append(panelElement);
}

}


//var colors = ["#C12926", "#862929", "#C12926", "#862929", "#AA1F39", "#DC4E26", "#724482", "#3E9945", "#317659", "#0498C3"];

/*Tabanı üste dayalı üçgenler

D3E8F4 x 6
899DA6 x 3
FFFFFF x 3*/

var upperColsConfig = [
  {
    "color": "#D3E8F4",
    "num": 6
  },
  {
    "color": "#899DA6",
    "num": 3
  },
  {
    "color": "#FFFFFF",
    "num": 3
  }
];

/*Tabanı alta dayalı üçgenler (eğer bu ayrımı yapabiliyosak tabi, yapamıyosak da olur)

782221 x 3
B31A1C x 4
E74419 x 1
DD710C x 2
E4A8AA x 1
447907 x 1

*/

var lowerColsConfig = [
  {
    "color": "#782221",
    "num": 3
  },
  {
    "color": "#B31A1C",
    "num": 4
  },
  {
    "color": "#E74419",
    "num": 1
  },
  {
    "color": "#DD710C",
    "num": 2
  },
  {
    "color": "#E4A8AA",
    "num": 1
  },
  {
    "color": "#447907",
    "num": 1
  }
];

var upperCols = getColorArray(upperColsConfig);
var lowerCols = getColorArray(lowerColsConfig);

function getPanelElement(position, rotation, nextPositions, nextRotations, isTransparent, isMoving, isReverse, width, height, depth) {
  var colorPalette  = isReverse? lowerCols: upperCols;

  var colorInd = Math.floor(Math.random() * colorPalette.length);
  var geometry = "geometry=\"primitive: triangularPanel;";
  if (width) {
    geometry += "width:" + width + ";";
  }

  if (height) {
    geometry += "height:" + height + ";";
  }

  if (depth) {
    geometry += "depth:" + depth + ";";
  }

  if(isReverse) {
    geometry += "reverse:\"true\";";
  }

  geometry += "\"";

  var material = "material=\"color: " + colorPalette[colorInd] +";";
  if(isTransparent) {
    material += "transparent: true; opacity: 0.6;"
  }

  material +=  "\"";

  var base = "<a-entity " + geometry + " " + material + " " +
  "position=\"" + getPositionAsString(position) + "\" " +
  "rotation = \"" + getPositionAsString(rotation) + "\">";

  /*base += "<a-animation attribute=\"rotation\" dur =\"10000\"" +
  "to =\"0 180 0\" fill=\"forwards\"></a-animation>";*/

  if(isMoving) {
    var animationDuration = 4000;
    for (var posIndex = 1; posIndex < nextPositions.length; posIndex++) {
      base += "<a-animation attribute=\"position\" "+
      "dur=\"" + animationDuration + "\" " +
      "direction=\"normal\" " +
      "delay=\"" + (animationDuration * posIndex) + "\"" +
      "from=\"" + getPositionAsString(nextPositions[posIndex-1]) + "\"" +
      "to=\"" +  getPositionAsString(nextPositions[posIndex]) + "\" " +
      "repeat=\"0\"></a-animation>";

      base += "<a-animation attribute=\"rotation\" "+
      "dur=\"" + animationDuration + "\" " +
      "direction=\"normal\" " +
      "delay=\"" + (animationDuration * posIndex) + "\"" +
      "from=\"" + getPositionAsString(nextRotations[posIndex-1]) + "\"" +
      "to=\"" +  getPositionAsString(nextRotations[posIndex]) + "\" " +
      "repeat=\"0\"></a-animation>";
    }
  }


  return base + "</a-entity>";
}

function getPositionAsString(position) {
  return position.x + " " + position.y + " " + position.z ;
}

function getColorArray (paletteConfig) {
  var arr = [];
  paletteConfig.forEach(function(conf) {
    for (var i=0; i <conf.num; i++) {
      arr.push(conf.color);
    }
  });

  return arr;
}

function getXZCoords(theta, radius) {
  return {
    x: radius * Math.cos(theta),
    z: radius * Math.sin(theta)
  }
}
