/**
 * @author Séverin PONCIN
 * @author Charles PTACEK
 */

const express = require("express");
const router = express.Router();
const upload = require("express-fileupload");
var fs = require("fs");

/**
 * All the routes for background :
 *
 * GET /backgounds
 * POST /backgound {url}
 * GET /backgound/id
 * PUT /backgound/id {url}
 * DELETE /backgound/id
 *
 * Backgound Object has the following structure if is not an image:
 *  {
 *      url: './aquarium/img/poisson.png'
 *  }
 */

module.exports = function (client) {
  /** Library for receive uploaded image by client */
  router.use(upload());

  /**
   * HTTP GET /backgounds
   * This route will send you all the backgrounds
   */
  router.get("/backgrounds", isLogin, async (req, res) => {
    const result = await client
      .query({
        text: "SELECT * FROM backgrounds WHERE userid=$1",
        values: [req.session.user.id],
      })
      .catch((reason) => console.error(reason));
    res.json(result.rows);
  });

  /**
   * HTTP POST /backgound {Background : Object}
   * This route will create background,
   * if the background given is a file, the file will be add in
   * the folder with path : '/client/private/uploads/:userid/:image'
   * and the link will be add in database,
   * else the link will be add directly in the database.
   */
  router.post("/background", isLogin, async (req, res) => {
    let url = undefined;
    if (req.files) {
      let image = req.files.image;
      let filename = image.name.replace(/ /g, "_");
      const url_folder = "./client/private/uploads/" + req.session.user.id;

      if (!fs.existsSync(url_folder)) {
        fs.mkdirSync(url_folder);
      }

      await image.mv(url_folder + "/" + filename);

      url = "/aquarium/uploads/" + req.session.user.id + "/" + filename;
    } else {
      url = req.body.url;
    }

    if (url === undefined || typeof url !== "string" || url === "") {
      res.status(400).json({ message: "invalid background url" });
      return;
    }

    const result = await client.query({
      text: "INSERT INTO backgrounds (userid,url) VALUES ($1,$2) RETURNING *",
      values: [req.session.user.id, url],
    });

    res.json(result.rows[0]);
  });

  router
    .route("/background/:id")
    /**
     * HTTP GET /background/:id
     * This route will send you the background with the id giving in params
     */
    .get(isLogin, parseRequest, async (req, res) => {
      res.json(req.background);
    })
    /**
     * HTTP DELETE /background/:id
     * This route will delete the background with the id giving in params,
     * if the link target an image in a folder with path : '/client/private/uploads/:userid/:image'
     * the image will be delete of the disk
     */
    .delete(isLogin, parseRequest, async (req, res) => {
      await client.query({
        text: "DELETE FROM backgrounds WHERE backgroundid=$1",
        values: [req.background.backgroundid],
      });

      if (req.background.url.includes("/aquarium/uploads/")) {
        const urlFile = req.background.url.replace(
          "/aquarium/",
          "./client/private/"
        );
        if (fs.existsSync(urlFile)) {
          const result = await client
            .query({
              text: "SELECT * FROM backgrounds WHERE userid=$1 AND url=$2",
              values: [req.session.user.id, req.background.url],
            })
            .catch((reason) => console.error(reason));

          if (result.rowCount === 0) {
            fs.unlinkSync(urlFile);
            let folder = "./client/private/uploads/" + req.session.user.id;
            if (fs.existsSync(folder)) {
              let files = fs.readdirSync(folder);
              if (files.length === 0) fs.rmdirSync(folder);
            }
          }
        }
      }

      res.json(req.background.backgroundid);
    })
    /**
     * HTTP PUT /background/:id - {Background : Object}
     * This route will update the background with the value giving in the body of the request
     */
    .put(isLogin, parseRequest, async (req, res) => {
      if (req.body.url !== undefined) {
        const result = await client.query({
          text: "UPDATE backgrounds SET url=$1 WHERE backgroundid=$2 RETURNING *",
          values: [req.body.url, req.background.backgroundid],
        });
        res.json(result.rows[0]);
      } else {
        const result = await client.query({
          text: "UPDATE users SET backgroundid=$1 WHERE userid=$2 RETURNING *",
          values: [req.background.backgroundid, req.session.user.id],
        });
        req.session.user.backgroundid = req.background.backgroundid;
        res.json(req.background.backgroundid);
      }
    });

  /**
   * Check the data given in the request
   */
  async function parseRequest(req, res, next) {
    const backgroundid = parseInt(req.params.id);

    if (isNaN(backgroundid)) {
      res.status(400).json({ message: "id should be a number" });
      return;
    }

    const result = await client.query({
      text: "SELECT * FROM backgrounds WHERE backgroundid=$1 AND userid=$2",
      values: [backgroundid, req.session.user.id],
    });

    if (result.rows.length <= 0) {
      res
        .status(404)
        .json({ message: "background " + backgroundid + " does not exist" });
      return;
    }

    req.background = result.rows[0];
    next();
  }

  /**
   * Check if the user is login
   */
  function isLogin(req, res, next) {
    if (req.session.user === undefined)
      res.status(401).json({ message: "You must be connect" });
    else next();
  }

  return router;
};
