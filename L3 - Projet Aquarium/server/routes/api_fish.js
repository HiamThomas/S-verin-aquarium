/**
 * @author Séverin PONCIN
 * @author Charles PTACEK
 */
const express = require("express");
const router = express.Router();

/**
 * All the routes for fish:
 *
 * GET /fishs
 * POST /fish {Fish : Object}
 * GET /fish/:id
 * PUT /fish/:id {Fish : Object}
 * DELETE /fish/:id
 *
 * Fish Object has the following structure :
 *  {
 *      fishid: 0,
 *      name: 'Fish',
 *      color: 0,
 *      speed: 1.5,
 *      size: 1,
 *      url: './aquarium/img/poisson.png',
 *      flip: false
 *  }
 */

module.exports = function (client) {
  /**
   * HTTP GET /fishs
   * This route will send you all the fishs
   */
  router.get("/fishs", isLogin, async (req, res, next) => {
    const result = await client.query({
      text: "SELECT * FROM fishs WHERE userid=$1 ORDER BY fishid DESC",
      values: [req.session.user.id],
    });
    res.json(result.rows);
  });

  /**
   * HTTP POST /fish {Fish : Object}
   * This route will create a fish by adding them in data base
   */
  router.post("/fish", isLogin, async (req, res) => {
    let fish = req.body;

    if (
      fish.name === undefined ||
      typeof fish.name !== "string" ||
      fish.name === "" ||
      fish.color === undefined ||
      isNaN(fish.color) ||
      fish.color < 0 ||
      fish.speed === undefined ||
      isNaN(fish.speed) ||
      fish.speed < 0 ||
      fish.size === undefined ||
      isNaN(fish.size) ||
      fish.size < 0 ||
      fish.flip === undefined ||
      typeof fish.flip !== "boolean" ||
      fish.url === undefined ||
      typeof fish.url !== "string" ||
      fish.url === ""
    ) {
      res.status(400).json({ message: "invalid fish" });
      return;
    }

    const result = await client.query({
      text: "INSERT INTO fishs (userid,name,color,speed,size,url,flip) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      values: [req.session.user.id, fish.name, fish.color, fish.speed, fish.size, fish.url, fish.flip],
    });
    res.json(result.rows[0]);
  });

  router
    .route("/fish/:id")
    /**
     * HTTP GET /fish/:id
     * This route will send you the fish with the id giving in params
     */
    .get(isLogin, parseRequest, async (req, res) => {
      res.json(req.fish);
    })
    /**
     * HTTP DELETE /fish/:id
     * This route will delete the fish with the id giving in params
     */
    .delete(isLogin, parseRequest, async (req, res) => {
      await client.query({
        text: "DELETE FROM fishs WHERE fishid=$1",
        values: [req.fish.fishid],
      });
      res.json(req.fish.fishid);
    })
    /**
     * HTTP PUT /fish/:id - {Fish : Object}
     * This route will update the fish with the value giving in the body of the request
     */
    .put(isLogin, parseRequest, async (req, res) => {
      const fishModify = req.body;

      if (
        fishModify.name === undefined ||
        typeof fishModify.name !== "string" ||
        fishModify.name === "" ||
        fishModify.color === undefined ||
        isNaN(fishModify.color) ||
        fishModify.color < 0 ||
        fishModify.speed === undefined ||
        isNaN(fishModify.speed) ||
        fishModify.speed < 0 ||
        fishModify.size === undefined ||
        isNaN(fishModify.size) ||
        fishModify.size < 0 ||
        fishModify.flip === undefined ||
        typeof fishModify.flip !== "boolean" ||
        fishModify.url === undefined ||
        typeof fishModify.url !== "string" ||
        fishModify.url === ""
      ) {
        res.status(400).json({ message: "invalid fish" });
        return;
      }

      const result = await client.query({
        text: "UPDATE fishs SET name=$1,color=$2,speed=$3,size=$4,url=$5,flip=$6 WHERE fishid=$7 RETURNING *",
        values: [
          fishModify.name,
          fishModify.color,
          fishModify.speed,
          fishModify.size,
          fishModify.url,
          fishModify.flip,
          req.fish.fishid,
        ],
      });
      res.json(result.rows[0]);
    });

  /**
   * Check the data given in the request
   */
  async function parseRequest(req, res, next) {
    const fishid = parseInt(req.params.id);

    if (isNaN(fishid)) {
      res.status(400).json({ message: "id should be a number" });
      return;
    }

    const result = await client.query({
      text: "SELECT * FROM fishs WHERE fishid=$1 AND userid=$2",
      values: [fishid, req.session.user.id],
    });

    if (result.rows.length <= 0) {
      res.status(404).json({ message: "fish " + fishid + " does not exist" });
      return;
    }

    req.fish = result.rows[0];
    next();
  }

  /**
   * Check if the user is login
   */
  function isLogin(req, res, next) {
    if (req.session.user === undefined) res.status(401).json({ message: "You must be connect" });
    else next();
  }

  return router;
};
