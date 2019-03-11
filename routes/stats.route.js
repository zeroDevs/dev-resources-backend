const route = require('express').Router();
const dbHandler = require('../db/resource.db');
const userDbHandler = require('../db/user.db');

route.get('/', async (req, res) => {
  let result;
  try {
    result = await dbHandler.stats();
    resourceCount = await dbHandler.count();
    userCount = await userDbHandler.count();
  } catch (e) {
    return res.status(500).json({
      message: 'Something went wrong. Please try again later'
    });
  }
  if (result.error) return res.status(500).json({ result });
  const response = { ...result };
  response.payload['resourcesCount'] = resourceCount.payload.count;
  response.payload['usersCount'] = userCount.payload.count;
  res.json(result);
});

module.exports = route;
