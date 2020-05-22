const { Client } = require('pg'); // imports the pg module

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');


async function getAllUsers() {
    try {
      const { rows } = await client.query(`
        SELECT id, username, name, location, active 
        FROM users;
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
}

async function createUser({ 
    username, 
    password,
    name,
    location
  }) {
    try {
        const { rows: [ user ] } = await client.query(`
        INSERT INTO users(username, password, name, location) 
        VALUES($1, $2, $3, $4) 
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
        `, [username, password, name, location]);
  
      return user;
    } catch (error) {
      throw error;
    }
}

async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map( // use map to turn each key into a string that looks like "keyName"=$3 where the key name is in quotes:
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ user ] } = await client.query(`
        UPDATE users
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return user;
    } catch (error) {
      throw error;
    }
}

async function createPost({
    authorId,
    title,
    content
  }) {
    try {
        const { rows: [ post ] } = await client.query(`
          INSERT INTO posts("authorId", title, content) 
          VALUES($1, $2, $3)
          RETURNING *;
        `, [authorId, title, content]);
    
        return post;
      } catch (error) {
        throw error;
      }
}

async function updatePost(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
    ).join(', ');
  
    // return early if this is called without fields
    if (setString.length === 0) {
      return;
    }
  
    try {
      const { rows: [ post ] } = await client.query(`
        UPDATE posts
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
  
      return post;
    } catch (error) {
      throw error;
    }
}

async function getAllPosts() {
    try {
      const { rows } = await client.query(`
        SELECT *
        FROM posts;
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
}

// 'getPostsByUser' can be used to make two queries inside the same method:
async function getPostsByUser(userId) {
    try {
      const { rows } = await client.query(`
        SELECT * 
        FROM posts
        WHERE "authorId"=${ userId };
      `);
  
      return rows;
    } catch (error) {
      throw error;
    }
}

async function getUserById(userId) {
    try {
        // first get the user: (Remember the query returns an object that contains a `rows` array that (in this case) will contain one object, which is our user.)
      const { rows: [ user ] } = await client.query(`
        SELECT id, username, name, location, active
        FROM users
        WHERE id=${ userId }
      `);
        // if it doesn't exist (if there are no `rows` or `rows.length`), return null:
      if (!user) {
        return null
      }
    // get their posts (use getPostsByUser)
    // then add the posts to the user object with key 'posts'
      user.posts = await getPostsByUser(userId);
  
      // return the user object:
      return user;
    } catch (error) {
      throw error;
    }
}

// and export them
module.exports = {  
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser
}
