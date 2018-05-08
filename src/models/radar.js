const MalformedDataError = require('../exceptions/malformedDataError');
const ExceptionMessages = require('../util/exceptionMessages');

const _ = {
  map: require('lodash/map'),
  uniqBy: require('lodash/uniqBy'),
  sortBy: require('lodash/sortBy')
};

const Radar = function(numberOfPiePieces) {
  var self, quadrants, blipNumber, addingQuadrant;

  blipNumber = 0;
  addingQuadrant = 0;
  angle = parseInt(360.0 / numberOfPiePieces)
  console.log(numberOfPiePieces, 'numberOfPiePieces')
  quadrants = [];
  for(var i=0; i < numberOfPiePieces; ++i){
    console.log('number of pie pieces', angle*i, i)
    quadrants.push({order: 'order_'+i, startAngle: angle*(i+1)})
  }
  // console.log('quadrants', quadrants)
  // quadrants = [];
  // quadrants = [
  //   {order: 'xfirst', startAngle: angle*1},
  //   {order: 'xsecond', startAngle: angle*2},
  //   {order: 'xthird', startAngle: angle*3},
  //   {order: 'xfourth', startAngle: angle*4},
  //   {order: 'xfith', startAngle: angle*5}
  // ];
  // console.log('quadrants---', quadrants)
  self = {};

  function setNumbers(blips) {
    blips.forEach(function (blip) {
      blip.setNumber(++blipNumber);
    });
  }

  self.addQuadrant = function (quadrant) {
    if(addingQuadrant >= 4) {
      // throw new MalformedDataError(ExceptionMessages.TOO_MANY_QUADRANTS);
    }
    quadrants[addingQuadrant].quadrant = quadrant;
    setNumbers(quadrant.blips());
    addingQuadrant++;
  };

   function allQuadrants() {
    if (addingQuadrant < 4)
      // throw new MalformedDataError(ExceptionMessages.LESS_THAN_FOUR_QUADRANTS);
    console.log(quadrants)
    return _.map(quadrants, 'quadrant');
  }

  function allBlips() {
    console.log(allQuadrants())
    return allQuadrants().reduce(function (blips, quadrant) {
      return blips.concat(quadrant.blips());
    }, []);
  }

  self.rings = function () {
    return _.sortBy(_.map(_.uniqBy(allBlips(), function (blip) {
      return blip.ring().name();
    }), function (blip) {
      return blip.ring();
    }), function (ring) {
      return ring.order();
    });
  };

  self.quadrants = function () {
    return quadrants;
  };

  return self;
};

module.exports = Radar;
