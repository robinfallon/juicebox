/***** TAGS ROUTER *****/

const express = require('express');
const tagsRouter = express.Router();

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    // read the tagname from the params
    try {
        const tags = await getAllTags();
      // use our method to get posts by tag name from the db
      const tags = allTags.filter(post => {
  
      });
      // send out an object to the client { posts: // the posts }
      console.log("A request is being made to /tags");
    } catch ({ name, message }) {
      // forward the name and message to the error handler
      res.send({ message: 'these are /tags!' });
    }
  });

module.exports = tagsRouter;






