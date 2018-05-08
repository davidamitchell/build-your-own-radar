document.title = 'Inline Data Example'


// store data inline directly as a table...
// const rawDataTable = [
//     [ 'name',                          'ring',   'quadrant',               'isNew', 'description' ],
//     [ 'Grafana',                       'core',  'customer',                  'TRUE',  'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Packer',                        'core',  'customer',                  'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Apache Kafka',                  'level 4',  'customer',                  'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Spring Boot',                   'core',  'transactions', 'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'AngularJS',                     'level 3',   'transactions', 'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Docker',                        'core',  'accounts',              'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Pivotal Cloud Foundry',         'level 4',  'accounts',              'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'AWS Application Load Balancer', 'assess', 'accounts',              'TRUE',  'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Overambitious API gateways',    'level 3',   'accounts',              'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Superficial private cloud',     'level 3',   'accounts',              'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Pipelines as code',             'core',  'techniques',             'TRUE',  'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Bug bounties',                  'level 4',  'techniques',             'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ],
//     [ 'Cloud lift and shift',          'level 3',   'eetechniques',             'FALSE', 'This is the description. You can use basic html such as the <strong>strong tag to emphasise keywords and phrases</strong> and insert <a href="https://www.thoughtworks.com">anchor links to documentation and referance material</a>.' ]
// ]
//
// // which will need to be converted to an array of objects...
// var rawData = rawDataTable.slice(1).map(function(x) {
//     // likely a better way to do this ?
//     var response = {}
//     for (var i = 0; i < x.length; i++)  {
//         response[rawDataTable[0][i]] = x[i];
//     }
//     return response
// })
// console.log(rawData)
const _ = {
    map: require('lodash/map'),
    uniqBy: require('lodash/uniqBy'),
    capitalize: require('lodash/capitalize'),
    each: require('lodash/each')
};

const InputSanitizer = require('./inputSanitizer');
const Radar = require('../models/radar');
const Quadrant = require('../models/quadrant');
const Ring = require('../models/ring');
const Blip = require('../models/blip');
const GraphingRadar = require('../graphing/radar');
const MalformedDataError = require('../exceptions/malformedDataError');
const ContentValidator = require('./contentValidator');
const ExceptionMessages = require('./exceptionMessages');

const InlineSheet = function () {
    var self = {};

    self.build = function (data) {
        var rawData = data;
        var columnNames = Object.keys(rawData[0])

        var contentValidator = new ContentValidator(columnNames);
        contentValidator.verifyContent();
        contentValidator.verifyHeaders();

        var all = rawData;
        var blips = _.map(all, new InputSanitizer().sanitize);
        var rings = _.map(_.uniqBy(blips, 'ring'), 'ring');
        var ringMap = {};
        var maxRings = 4;

        _.each(rings, function (ringName, i) {
            if (i == maxRings) {
                // throw new MalformedDataError(ExceptionMessages.TOO_MANY_RINGS);
            }
            ringMap[ringName] = new Ring(ringName, i);
        });

        var numberOfPiePieces = 0
        var quadrants = {};
        _.each(blips, function (blip) {
            if (!quadrants[blip.quadrant]) {
                ++numberOfPiePieces;
                quadrants[blip.quadrant] = new Quadrant(_.capitalize(blip.quadrant));
            }
            quadrants[blip.quadrant].add(new Blip(blip.name, ringMap[blip.ring], blip.isNew.toLowerCase() === 'true', blip.topic, blip.description))
        });
        console.log('build quadrants',quadrants, numberOfPiePieces);
        var radar = new Radar(numberOfPiePieces);
        _.each(quadrants, function (quadrant) {
            radar.addQuadrant(quadrant)
        });

        var size = (window.innerHeight - 133) < 620 ? 620 : window.innerHeight - 133;
        new GraphingRadar(size, radar, numberOfPiePieces).init().plot();
      };

      return self;
};

module.exports = InlineSheet;
