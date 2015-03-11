var AbstractExtendedActivityDataModifier = Fiber.extend(function(base) {

    return {

        extendedActivityDataWidth: '900px',

        content: '',

        dataViews: [],

        init: function(analysisData, appResources, userSettings, athleteId, athleteIdAuthorOfActivity) {
            console.log('AbstractExtendedActivityDataModifier::init');

            this.analysisData_ = analysisData;
            this.appResources_ = appResources;
            this.userSettings_ = userSettings;
            this.athleteId_ = athleteId;
            this.athleteIdAuthorOfActivity_ = athleteIdAuthorOfActivity;

        },

        modify: function() {

            _.each(this.dataViews, function(view) {
                // Append result of view.render() to this.content
                view.render();
                this.content += view.getContent();
            }.bind(this));

            // Add Show extended statistics to page
            this.placeExtendedStatsButton(function() {
                // Button has been placed...
            });

        },

        placeExtendedStatsButton: function(buttonAdded) {

            var htmlButton = '<section>';
            htmlButton += '<a class="button btn-block btn-primary" id="extendedStatsButton" href="#">';
            htmlButton += 'Show extended statistics';
            htmlButton += '</a>';
            htmlButton += '</section>';

            jQuery('.inline-stats.section').first().after(htmlButton).each(function() {

                jQuery('#extendedStatsButton').click(function() {

                    jQuery.fancybox({
                        'width': this.extendedActivityDataWidth,
                        'height': '90%',
                        'autoScale': true,
                        'transitionIn': 'fade',
                        'transitionOut': 'fade',
                        'type': 'iframe',
                        'content': '<div class="stravaPlusExtendedData">' + this.content + '</div>'
                    });

                    // For each view start making the assossiated graphs
                    _.each(this.dataViews, function(view) {
                        view.displayGraph();
                    }.bind(this));


                }.bind(this));

                if (buttonAdded) buttonAdded();

            }.bind(this));
        },

        /**
         * Affect default view needed
         */
        setDataViewsNeeded: function() {

            // By default we have... If data exist of course...

            // Featured view
            if (this.analysisData_) {
                var featuredDataView = new FeaturedDataView(this.analysisData_);
                featuredDataView.setAppResources(this.appResources_);
                this.dataViews.push(featuredDataView);
            }

            // Speed view
            if (this.analysisData_.speedData) {
                var speedDataView = new SpeedDataView(this.analysisData_.speedData);
                speedDataView.setAppResources(this.appResources_);
                this.dataViews.push(speedDataView);
            }

            // // Heart view
            if (this.analysisData_.heartRateData) {
                var heartRateDataView = new HeartRateDataView(this.analysisData_.heartRateData);
                heartRateDataView.setAppResources(this.appResources_);
                this.dataViews.push(heartRateDataView);
            }

        }
    }
});
