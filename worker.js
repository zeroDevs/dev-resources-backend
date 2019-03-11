const CronJob = require('cron').CronJob;
const getContribs = require('./utils/getContribs');

new CronJob(
  '0 */10 * * * *',
  async function() {
    getContribs();
  },
  null,
  true,
  'America/Los_Angeles'
);
