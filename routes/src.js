const express = require('express');
const router = express.Router();
const prpl = require('prpl-server');
/* GET home page. */
  router.get('/src', prpl.makeHandler('.', {
    httpsRedirect: true,
    entrypoint: 'views/index.html',
    unregisterMissingServiceWorkers: false,
   /* builds: [
     // {name: 'build/modern', browserCapabilities: ['es2015', 'push']},
      {name: 'build/fallback'}
    ],*/
  })
);

module.exports = router;
