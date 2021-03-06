// https://gist.github.com/mauvm/172878a9646095d03fd7

import Jasmine from 'jasmine';

const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

const jasmine = new Jasmine();

// https://github.com/bcaudan/jasmine-spec-reporter/blob/master/docs/jasmine-npm-configuration.md#configuration
jasmine.env.clearReporters(); // jasmine >= 2.5.2, remove default reporter logs
jasmine.env.addReporter(new SpecReporter({ // add jasmine-spec-reporter
  spec: {
    displayPending: true,
  },
}));
// jasmine.addReporter(new SpecReporter.SpecReporter()); // add jasmine-spec-reporter

jasmine.loadConfigFile('jasmine.json'); // load jasmine.json configuration. spec_files is relative to run.js
jasmine.execute();
