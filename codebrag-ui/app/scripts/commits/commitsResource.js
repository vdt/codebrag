angular.module('codebrag.commits')

    .factory('Commits', function ($resource) {

        var commitsListLoadingRequest = 'commitsList';

        var loadCommitsToReviewParams = {filter: 'to_review'};
        var loadCommitWithSurroundings = {context: true};

        return $resource('rest/commits/:sha', {}, {
            queryReviewable: {method: 'GET', isArray: false, requestType: commitsListLoadingRequest, params: loadCommitsToReviewParams},
            queryWithSurroundings: {method: 'GET', isArray: false, requestType: commitsListLoadingRequest, params: loadCommitWithSurroundings},
            query: {method: 'GET', isArray: false, requestType: commitsListLoadingRequest},
            querySilent: {method: 'GET', isArray: false},
            get: {method: 'GET', isArray: false}
        });
    });