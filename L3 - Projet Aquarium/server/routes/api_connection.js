/**
 * @author Séverin PONCIN
 * @author Charles PTACEK
 */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const dataFishs = require("../data/fishs.js");
const dataBackgrounds = require("../data/backgrounds.js");

module.exports = function (client) {
  async function insertBackground(userid, background) {
    return await client.query({
      text: "INSERT INTO backgrounds (userid,url) VALUES ($1,$2) RETURNING backgroundid",
      values: [userid, background.url],
    });
  }

  router.post("/register", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    selectAccount(email).then((result) => {
      if (result.rowCount >= 1) {
        res
          .status(400)
          .json({
            message: 'A user with the mail "' + email + '" already exist',
          });
        return;
      }

      bcrypt.hash(password, 10).then((hash) => {
        registerAccount(email, hash).then(async (resultInsert) => {
          try {
            for (const fish of dataFishs) {
              client.query({
                text: "INSERT INTO fishs (userid,name,color,speed,size,url,flip) VALUES ($1,$2,$3,$4,$5,$6,$7)",
                values: [
                  resultInsert.rows[0].userid,
                  fish.name,
                  fish.color,
                  fish.speed,
                  fish.size,
                  fish.url,
                  fish.flip,
                ],
              });
            }

            const resultBackground = await insertBackground(
              resultInsert.rows[0].userid,
              dataBackgrounds[0]
            );
            await client.query({
              text: "UPDATE users SET backgroundid=$1 WHERE userid=$2 RETURNING *",
              values: [
                resultBackground.rows[0].backgroundid,
                resultInsert.rows[0].userid,
              ],
            });

            for (let i = 1; i < dataBackgrounds.length; i++)
              insertBackground(resultInsert.rows[0].userid, dataBackgrounds[i]);
          } catch (error) {
            console.error(error);
          }

          res.json({ message: "Your account has been register." });
        });
      });
    });
  });

  router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (req.session.user !== undefined) {
      res.status(401).json({ message: "You are already login" });
      return;
    }

    selectAccount(email).then((result) => {
      if (result.rowCount < 1) {
        res
          .status(400)
          .json({ message: 'No user exists with this mail "' + email + '"' });
        return;
      }

      const hash = result.rows[0].password;
      bcrypt.compare(password, hash).then((accept) => {
        if (accept) {
          req.session.user = {
            id: result.rows[0].userid,
            email: result.rows[0].email,
            backgroundid: result.rows[0].backgroundid,
          };
          res.json(req.session.user);
        } else {
          res.status(401).json({ message: "Unvalid Login" });
        }
      });
    });
  });

  router.get("/me", (req, res) => {
    if (req.session.user === undefined) {
      res.status(401).json({ message: "You are not login" });
      return;
    }
    res.json(req.session.user);
  });

  router.delete("/me", (req, res) => {
    if (req.session.user === undefined) {
      res.status(401).json({ message: "You are not login" });
      return;
    }
    req.session.destroy();
    res.json({ message: "You have been disconnected." });
  });

  async function selectAccount(email) {
    return await client.query({
      text: "SELECT * FROM users WHERE email=$1",
      values: [email],
    });
  }

  async function registerAccount(email, password) {
    return await client.query({
      text: "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *",
      values: [email, password],
    });
  }
  return router;
};
