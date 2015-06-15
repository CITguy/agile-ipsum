/*
 * Mimics Ruby `Array#sample` to return a random item from the array.
 */
Array.prototype.sample = function () {
    if (this.length > 0) {
        return this[Math.floor(Math.random() * this.length)];
    } else {
        return null;
    }
};

var app = angular.module('agileipsum', ['ngInflection']);

app.controller('loremCtrl', function ($scope, $http, Lorem) {
    var lorem;
    $scope.ready = false;
    $scope.vocabulary = 'agile';
    $scope.vocabs = [
        'agile',
        'bangbiz'
    ];

    // TEST
    var tmpl = "NOUN: {{noun}}, VERB: {{verb}}";
    var scp = {
        noun: "Ryan",
        verb: "rocks"
    };
    var scp2 = {
      get noun() {
        return "NOUN";
      },
      get verb() {
        return "HERRO";
      }
    };
    $scope.compiled = Handlebars.compile(tmpl)(scp2);
    //END:TEST

    var reset = function () {
        $scope.numParagraphs = 1;
        $scope.paragraphs = [];
    };

    $scope.$watch('vocabulary', function (newVal) {
        var file = 'vocab-' + newVal + '.json';
        $http.get(file)
            .success(function (response) {
                reset();
                lorem = new Lorem(response);
                $scope.ready = true;
            })
            .error(function () {
                $scope.ready = false;
                // TODO: display error message on page
                console.error('Could not load vocabulary: ', file);
            });
    });

    $scope.generateIpsum = function () {
        if ($scope.ready) {
            $scope.paragraphs = lorem.paragraphs($scope.numParagraphs);

            $scope.phrase = lorem.phrase();
        }

    };

    reset();
});

/**
 * @param {Object.noun} vocabulary - object to instantiate Lorem instance.
 * @return {Function} constructor function for new Lorem object
 */
app.service('Lorem', function ($filter) {
    return function (vocab) {
        var VocabGenerator = {
            get noun() { return vocab.noun.sample(); },
            get verb() { return vocab.verb.sample(); },
            get adjective() { return vocab.adjective.sample(); },
            get adverb() { return vocab.adverb.sample(); },
            get abbreviation() { return vocab.abbreviation.sample(); },
            get ingverb() { return vocab.ingverb.sample(); },
            get preposition() { return vocab.preposition.sample(); }
        };

        var _phrase = function () {
            var phrase = Handlebars.compile(vocab.phrase.sample())(VocabGenerator);
            // Ensure first letter is capitalized
            phrase = phrase.replace(/^[a-z]/, function (c) { return c.toUpperCase(); });
            return phrase;
        };

        var _paragraph = function () {
            var phrases = [],
                paragraph,
                limit = chance.natural({min: 4, max: 6});

            while(limit--) {
                phrases.push(_phrase());
            }

            paragraph = phrases.join(' ');

            return paragraph
        };//_paragraph

        var generateParagraphs = function (count) {
            var paragraphs = [];
            count = count || 0;
            while(count--) {
                paragraphs.push(_paragraph());
            }
            return paragraphs;
        };

        return {
            paragraphs: generateParagraphs,
            phrase: _phrase
        };
    };
});

/**
 * Attribute directive to be placed on an HTML element whose text you want
 * the user to select upon clicking.
 */
app.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                var range = document.createRange();
                range.selectNode(element[0]);
                window.getSelection().addRange(range);
            });
        }
    };
});//selectOnClick
