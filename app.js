var app = angular.module('agileipsum', ['ngInflection']);

app.controller('loremCtrl', function ($scope, loremSvc) {
    $scope.numParagraphs = 1;
    $scope.paragraphs = [];

    $scope.generateIpsum = function () {
        $scope.paragraphs = loremSvc.paragraphs($scope.numParagraphs);
    };
});

app.factory('wordBank', function (words) {
    return function () {
        var self = this;
        var _lastIdx;

        var _data = words.nouns;
        _data.isEmpty = function () {
            return this.length > 0 ? false : true;
        };

        var _randomIdx = function () {
            if (_data.isEmpty()) {
                return 0;
            } else {
                return chance.natural({
                    min: 0,
                    max: (_data.length - 1)
                });
            }
        };//_randomIdx

        self.randomWord = function () {
            var out;
            if (_data.isEmpty()) {
                return '';
            } else {
                var idx = _randomIdx();
                while(idx === _lastIdx) {
                    idx = _randomIdx();
                }
                out = _data[idx];
                _lastIdx = idx;
                return out;
            }
        };
    };
});//wordBank

app.factory('loremSvc', function (wordBank) {
    var svc = {};
    var bank = new wordBank();

    var generateSentence = function () {
        var sentence, lastIdx, currentIdx,
            words = [],
            size = chance.natural({min: 7, max:13});

        // push random words
        while(size--) {
            words.push(bank.randomWord());
        }
        sentence = words.join(' ');
        return sentence + '.';
    };//generateSentence

    var generateParagraph = function () {
        var sentences = [],
            paragraph,
            limit = chance.natural({min: 4, max: 7});

        while(limit--) {
            sentences.push(generateSentence());
        }

        paragraph = sentences.join(' ');

        return paragraph
    };//generateParagraph

    return {
        paragraphs: function (count) {
            var paragraphs = [];
            count = count || 0;
            while(count--) {
                paragraphs.push(generateParagraph());
            }
            return paragraphs;
        }
    };
});//loremSvc

app.factory('words', function () {
    return {
        nouns: [
            'ScrumMaster',
            'acceptance criteria',
            'acceptance test',
            'acceptance testing',
            'agile development practices',
            'agile manifesto',
            'agile project management',
            'agile software development',
            'alignment',
            'application lifecycle management',
            'application',
            'automation',
            'backlog grooming',
            'backlog item effort',
            'backlog item',
            'backlog',
            'big visible charts',
            'blocker',
            'bottleneck',
            'branch',
            'branching',
            'breaking the build',
            'bug',
            'build - measure - learn',
            'build process',
            'burndown chart',
            'burnup chart',
            'business alignment',
            'business value',
            'certified ScrumMaster',
            'chicken',
            'code smell',
            'collaboration',
            'colocation',
            'committment',
            'complexity',
            'continuous integration',
            'criteria',
            'cross-functional team',
            'customer',
            'cycle time',
            'daily scrum',
            'daily standup',
            'deadline',
            'definition of done',
            'design pattern',
            'distributed development team',
            'documentation',
            'domain model',
            'downward trend',
            'emergence',
            'empiricism',
            'employee',
            'epic',
            'error',
            'estimation',
            'extreme programming (XP)',
            'fail-fast',
            'feature',
            'feedback',
            'fibonacci sequence',
            'flow',
            'impediment',
            'inspect and adapt',
            'interaction',
            'interface',
            'iteration',
            'kanban',
            'lean software development',
            'level of effort',
            'lifecycle',
            'meeting',
            'methodology',
            'metrics',
            'minimum marketable features',
            'minimum viable product (MVP)',
            'model',
            'pace',
            'pair programming',
            'parallel development',
            'pattern',
            'pig',
            'pirate metrics',
            'planning game',
            'planning poker',
            'product backlog',
            'product owner',
            'product vision',
            'product',
            'production release',
            'project',
            'pull request (PR)',
            'refactoring',
            'relationships',
            'relative size',
            'release plan',
            'release planning',
            'requirements',
            'retrospective',
            'schedule',
            'scope',
            'scrum team',
            'scrum',
            'self-organization',
            'sequence',
            'simplicity',
            'spike',
            'sprint backlog',
            'sprint planning meeting',
            'sprint review',
            'sprint review',
            'sprint',
            'stakeholder',
            'standards',
            'standup meeting',
            'steady trend',
            'story points',
            'story',
            'task board',
            'task',
            'team',
            'technical debt',
            'test automation',
            'test-driven development',
            'timebox',
            'unit testing',
            'upward trend',
            'user story',
            'vanity metric',
            'velocity',
            'voice of the customer (VOC)',
            'wiki',
            'work in progress (WIP)',
        ]
    };
});//words
