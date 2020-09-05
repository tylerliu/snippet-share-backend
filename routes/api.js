let express = require('express');
let router = express.Router();
let {getFile, getList, insertFile, updateFile, deleteFile} = require("../models/SnippetModel");
let {verifyToken} = require("../models/AuthModel");

function base64Decode(base64_str) {
  return Buffer.from(base64_str.replace('-','/'), 'base64').toString()
}

// authorization
router.use('/:username', function(req, res, next) {
  const username = verifyToken(req.cookies.jwt)
  if (username == null || username !== req.params.username) {
    next({status: 401, message: "Unauthorized"})
  } else next();
})

/* GET users files. */
router.get('/:username', async function(req, res, next) {
  try {
    let result = await getList(req.params.username)
    res.send(JSON.stringify(result));
  } catch (err) {
    next(err);
  }
});

/* GET file. */
router.get('/:username/:fileBase64', async function(req, res, next) {
  try {
    let result = await getFile(req.params.username, base64Decode(req.params.fileBase64))
    if (result == null) {
      next({status: 404, message: "Snippet not found"})
      return
    }
    delete result._id;
    res.send(JSON.stringify(result));
  } catch (err) {
    next(err);
  }
});

/* POST insert file. */
router.post('/:username/:fileBase64', async function(req, res, next) {
  if (req.body.content === undefined) {
    next({status: 400, message: "Invalid request content"})
    return;
  }
  let visible = false;
  if (req.body.visible === true || req.body.visible === "1" || req.body.visible === "true") {
    visible = true;
  } else if (req.body.visible === false || req.body.visible === "0" || req.body.visible === "false") {
    visible = false;
  } else {
    next({status: 400, message: "Invalid request: visibility"})
    return;
  }

  try {
    let result = await insertFile(req.params.username, base64Decode(req.params.fileBase64), req.body.content, visible)
    if (!result) {
      next({status: 400, message: "The file name already exists"})
    }
    else {
      res.status(201)
      res.send("Created")
    }
  } catch (err) {
    next(err);
  }
});

/* PUT update file. */
router.put('/:username/:fileBase64', async function(req, res, next) {
  if (req.body.content === undefined) {
    next({status: 400, message: "Invalid request content"})
    return;
  }

  let visible = false;
  if (req.body.visible === true || req.body.visible === "1" || req.body.visible === "true") {
    visible = true;
  } else if (req.body.visible === false || req.body.visible === "0" || req.body.visible === "false") {
    visible = false;
  } else {
    next({status: 400, message: "Invalid request: visibility"})
    return;
  }

  try {
    let result = await updateFile(req.params.username, base64Decode(req.params.fileBase64), req.body.content, visible)
    if (!result) {
      next({status: 400, message: "The file does not exist"})
    }
    else {
      res.status(200)
      res.send("OK")
    }
  } catch (err) {
    next(err);
  }
});

/* DELETE file. */
router.delete('/:username/:fileBase64', async function(req, res, next) {

  try {
    let result = await deleteFile(req.params.username, base64Decode(req.params.fileBase64))
    if (!result) {
      next({status: 400, message: "The file does not exist"})
    }
    else {
      res.status(204)
      res.send("OK")
    }
  } catch (err) {
    next(err);
  }
});



module.exports = router;
