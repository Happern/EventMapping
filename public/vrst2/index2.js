AFRAME.registerGeometry('circularPanels', {
  schema: {
    radius: {
      default: 20
    },
    numPanels: {
      default: 20
    },
    panelHeight: {
      default: 20
    },
    panelDepth: {
      default: 2
    },
    centerPosition: {
      default: {x: 0, y:0, z: 0}
    },
    radiusChange: {
      default: 0
    },
    upsideDown: {
      default: false
    }
  },
  init: function (data) {
    var geometry = new THREE.Geometry();
    var vertices = getVertices(data.radius, data.numPanels, data.panelDepth, data.panelHeight, data.radiusChange, data.centerPosition);

    var faces = getFaces(vertices.length /2, data.upsideDown);

    geometry.vertices.push.apply(
      geometry.vertices, vertices
    );

    console.log('num reg vertices', geometry.vertices.length);


    geometry.faces.push.apply(
      geometry.faces, faces
    );

    geometry.faces[0].color = new THREE.Color(0,0,0);

      console.log('num reg faces', geometry.faces.length);
    this.geometry = geometry;
  }
});

function getXZCoords(theta, radius) {
  return {
    x: radius * Math.cos(theta),
    z: radius * Math.sin(theta)
  }
}

function getVerticesForLevel(radius, numPanels, panelDepth, center) {
  var angleGap = (2 * Math.PI) / numPanels;
  var vertices = [];
  for (var angle = 0; angle< 2 * Math.PI; angle += angleGap) {
      var outerVertex = getXZCoords(angle, radius);
      var innerVertex = getXZCoords(angle, radius - panelDepth);
      vertices.push(new THREE.Vector3(outerVertex.x + center.x, center.y, outerVertex.z + center.z));
      vertices.push(new THREE.Vector3(innerVertex.x + center.x, center.y, innerVertex.z + center.z));
  }
  return vertices;
}

function getVertices(radius, numPanels, panelDepth, panelHeight, radiusChange, centerPosition) {
  var bottomVertices = getVerticesForLevel(radius, numPanels, panelDepth, centerPosition);
  var topCenter = {
    x: centerPosition.x,
    y: centerPosition.y + panelHeight,
    z: centerPosition.z
  }
  var topVertices = getVerticesForLevel(radius + radiusChange, numPanels, panelDepth, topCenter);
  return bottomVertices.concat(topVertices);
}

function getFaces(numVerticesLevel, isUpsideDown) {
  // pairs of vertices define outer inner vertices ie q_1,i,level q_2,i,level
  // faces between q_1,i,level1 q_1,i,level2 q_2,i,level1 q_2,i,level2
  // faces between q_2,i,level1 q_2,i,level2 q_1,i+1,level1,q_1,i+1,level2
  faces = [];
  for (var pairIndex = 0; pairIndex< numVerticesLevel-1; pairIndex ++) {
    faces = faces.concat(getTriangularFace([pairIndex, pairIndex+1, pairIndex+numVerticesLevel+1, pairIndex+numVerticesLevel], isUpsideDown));
  }

  //faces.push(getRectangularFace([numVerticesLevel-1, 0, numVerticesLevel, 2 * numVerticesLevel-1]));

  return faces;
}

//SW (bottom-left) counter clock-wise indices

//color doesn't work
/*var faceInd = 0;
function getColor(ind) {
  return new THREE.Color((ind * 10) % 255, (ind) * 2 % 255, (ind * 20) % 255);
}*/
function getTriangularFace(vertexIndices, isUpsideDown) {
/*  faceInd++
  var col1 = getColor(faceInd);
  faceInd++;
  var col2 = getColor(faceInd);*/

  var faces;
  if (isUpsideDown) {
    faces = [new THREE.Face3(vertexIndices[0], vertexIndices[2], vertexIndices[3])];
  } else {
    faces = [new THREE.Face3(vertexIndices[0], vertexIndices[1], vertexIndices[2])];
  }
  return faces;
}

function getRectangularFace(vertexIndices) {
  return [new THREE.Face3(vertexIndices[0], vertexIndices[2], vertexIndices[3]),
  new THREE.Face3(vertexIndices[0], vertexIndices[1], vertexIndices[2])];
}


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

function getPanelElement(position, numPanels, radius, isUpsideDown, isMoving) {
  var pos = position.x + " " + position.y + " " + position.z;

  var colorPalette  = isUpsideDown? upperCols: lowerCols;
  var colorInd = Math.floor(Math.random() * colorPalette.length);

  var elm = "<a-entity position=" + "\"" + pos + "\" "  +
  "geometry=\"primitive: circularPanels; radius:"+ radius + "; numPanels: " + numPanels + ";";

  if (isUpsideDown) {
    elm += "upsideDown: true;"
  }

  elm += "\" material=\"color:"+ colorPalette[colorInd] + ";";

  if(isMoving) {
    elm += "transparent: true; opacity: 0.6;\" >" +
    "<a-animation attribute=\"rotation\"" +
                "to=\"0 360 0\"" +
                "dur=\"50000\"" +
                "repeat=\"indefinite\"></a-animation>";
  } else {
    elm +="\">";
  }

  return elm + "</a-entity>";
}

$(document).ready(function () {
  var numLayers = 8;
  var radius = 70;
  var radiusInc = 5;
  var yCoord = -40;
  var yInc = 20;
  var panelInc = 5;

  var sceneElement = $('#scene');

  var numPanels = 40;
  //var width = 20;
  //var height = 40;

  for (var layerInd = 0; layerInd < numLayers; layerInd++) {
    sceneElement.append(getPanelElement({x: 0, y:yCoord, z:0}, numPanels, radius-2, true, true));
    sceneElement.append(getPanelElement({x: 0, y:yCoord, z:0}, numPanels, radius, false, false));
    radius += radiusInc;
    yCoord += yInc;
    numPanels += panelInc;
  }
});

function getColorArray (paletteConfig) {
  var arr = [];
  paletteConfig.forEach(function(conf) {
    for (var i=0; i <conf.num; i++) {
      arr.push(conf.color);
    }
  });

  return arr;
}
