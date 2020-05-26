/*if the req.user hasn't been set (which means a correct auth token wasn't 
sent in with the request), we will send an error rather than 
moving on to the actual request*/

function requireUser(req, res, next) {
    if (!req.user) {
      next({
        name: "MissingUserError",
        message: "You must be logged in to perform this action"
      });
    }
  
    next();
  }
  
  module.exports = {
    requireUser
}