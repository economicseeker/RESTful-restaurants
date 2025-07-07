const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
// Steps:
// 1. Extract the id from req.params.
// 2. Find the starred restaurant in STARRED_RESTAURANTS by id.
// 3. If not found, send 404 status.
// 4. Otherwise, find the corresponding restaurant in ALL_RESTAURANTS using restaurantId.
// 5. If not found, send 404 status.
// 6. Otherwise, create an object with id, comment, and name, and send as JSON.
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const starredRestaurant = STARRED_RESTAURANTS.find(r => r.id === id);
  if (!starredRestaurant) {
    res.sendStatus(404);
    return;
  }
  const restaurant = ALL_RESTAURANTS.find(r => r.id === starredRestaurant.restaurantId);
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  res.json({
    id: starredRestaurant.id,
    comment: starredRestaurant.comment,
    name: restaurant.name
  });
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
// Steps:
// 1. Extract restaurantId and comment from req.body.
// 2. Check if the restaurantId exists in ALL_RESTAURANTS.
// 3. If not found, send 404 status.
// 4. Check if already starred (no duplicates).
// 5. If already starred, send 409 status (conflict).
// 6. Otherwise, generate a unique id for the new starred restaurant.
// 7. Create a new starred restaurant object and push to STARRED_RESTAURANTS.
// 8. Send the new starred restaurant as JSON with 201 status.
router.post('/', (req, res) => {
  const { restaurantId, comment } = req.body;
  // Check if the restaurant exists in ALL_RESTAURANTS
  const restaurant = ALL_RESTAURANTS.find(r => r.id === restaurantId);
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  // Check if already starred
  const alreadyStarred = STARRED_RESTAURANTS.some(r => r.restaurantId === restaurantId);
  if (alreadyStarred) {
    res.sendStatus(409); // Conflict
    return;
  }
  // Create new starred restaurant
  const newStarred = {
    id: uuidv4(),
    restaurantId,
    comment: comment || ''
  };
  STARRED_RESTAURANTS.push(newStarred);
  res.status(201).json(newStarred);
});

/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
// Steps:
// 1. Extract the id from req.params.
// 2. Filter STARRED_RESTAURANTS to remove the one with matching id.
// 3. If no restaurant was removed, send 404 status.
// 4. Otherwise, update STARRED_RESTAURANTS and send 200 status.
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const newList = STARRED_RESTAURANTS.filter(r => r.id !== id);
  if (newList.length === STARRED_RESTAURANTS.length) {
    res.sendStatus(404);
    return;
  }
  STARRED_RESTAURANTS = newList;
  res.sendStatus(200);
});

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
// Steps:
// 1. Extract the id from req.params and new comment from req.body.
// 2. Find the starred restaurant in STARRED_RESTAURANTS by id.
// 3. If not found, send 404 status.
// 4. Otherwise, update the comment and send 200 status.


module.exports = router;