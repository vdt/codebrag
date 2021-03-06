angular.module('codebrag.tour')

    .factory('pageTourService', function($document, $compile, $rootScope, authService, userSettingsService, events) {

        var tourDone, tourSteps = {
            commits: { ack: false },
            followups: { ack: false },
            invites: {
                ack: false,
                visible: function() {
                    return tourSteps.commits.ack && tourSteps.followups.ack;
                }
            }
        };

        var tourDOMAppender = (function() {
            var tourScope, tourDOMEl;
            return {
                remove: function() {
                    if(tourScope && tourDOMEl) {
                        tourDOMEl.remove();
                        tourScope.$destroy();
                    }
                },
                append: function() {
                    var el = angular.element('<page-tour></page-tour>');
                    tourScope = $rootScope.$new();
                    tourDOMEl = $compile(el)(tourScope);
                    var body = $document.find('body').eq(0);
                    body.append(tourDOMEl);
                }
            }
        })();

        function ackStep(stepName) {
            tourSteps[stepName].ack = true;
            if(shouldFinishTour()) {
                finishTour();
            }
        }

        function stepActive(stepName) {
            if(tourDone || angular.isUndefined(tourSteps[stepName])) return false;
            if(tourSteps[stepName].visible) {
                return !tourSteps[stepName].ack && tourSteps[stepName].visible();
            } else {
                return !tourSteps[stepName].ack;
            }
        }

        function initializeTour() {
            $rootScope.$on(events.loggedIn, setupUserTour);

            function setupUserTour() {
                var user = authService.loggedInUser;
                if(!user.settings.appTourDone) {
                    if(!user.isAdmin()) {
                        delete tourSteps.invites;
                    }
                    tourDOMAppender.append();
                } else {
                    tourDone = true;
                    tourDOMAppender.remove();
                }
            }
        }

        function shouldFinishTour() {
            return Object.getOwnPropertyNames(tourSteps).map(function(property) {
                return tourSteps[property].ack === true;
            }).reduce(function(res, el) {
                return res && el;
            }, true);
        }

        function finishTour() {
            tourDOMAppender.remove();
            tourDone = true;
            userSettingsService.save({appTourDone: true});
        }


        return {
            ackStep: ackStep,
            stepActive: stepActive,
            initializeTour: initializeTour
        }

    });
