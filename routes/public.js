let {getFileListForView, getFile} = require("../mongo-models/SnippetModel");
const express = require('express');
const CommonMark = require('commonmark');
let router = express.Router();
const escapeHtml = require('escape-html');
let mime = require('mime-types');
let moment = require('moment');
module.exports = router;

const parser = CommonMark.Parser()
const renderer = new CommonMark.HtmlRenderer()

function renderMarkdown(inputDoc){
    return renderer.render(parser.parse(inputDoc))
}

function timeToString(time_num) {
    return moment(time_num).fromNow();
}

function base64Encode(str) {
    return Buffer.from(str).toString('base64').replace('/','-')
}

function base64Decode(base64_str) {
    return Buffer.from(base64_str.replace('-','/'), 'base64').toString()
}

function renderContent(fileName, content) {
    if (fileName.endsWith(".html") || fileName.endsWith(".htm")) return content;
    if (fileName.endsWith(".md")) return renderMarkdown(content);
    if (fileName.endsWith(".txt") || fileName.endsWith(".text")) {
        return `<pre><code class="plaintext">${escapeHtml(content)}</code></pre>`
    }
    return `<pre><code>${escapeHtml(content)}</code></pre>`;
}

router.get('/:username', function(req, res, next) {

    getFileListForView(req.params.username)
        .then((result) => {
            result = result.map((p)=>{
                p.content = renderContent(p.fileName, p.content)
                p.modified = timeToString(p.modified)
                p.fileLink = `${req.baseUrl}/${req.params.username}/${base64Encode(p.fileName)}`
                return p
            })
            res.render('fileList', {results: result, username: req.params.username})
        }).catch((err) => {
            next(err);
        })
});

/* GET file. */
router.get('/:username/:fileBase64', function(req, res, next) {
    getFile(req.params.username, base64Decode(req.params.fileBase64))
        .then((result) => {
            if (result == null) {
                next({status: 404, message: "File not found with name: " + base64Decode(req.params.fileBase64)})
                return;
            }

            res.render('file', {fileName: result.fileName, content: renderContent(result.fileName, result.content),
                modified: timeToString(result.modified),
                rawLink: `${req.baseUrl}/${req.params.username}/${req.params.fileBase64}/${encodeURIComponent(result.fileName)}`})
        })
        .catch((err) => {
            next(err);
        })
});

/* GET file. */
router.get('/:username/:fileBase64/:fileName', function(req, res, next) {
    if (base64Decode(req.params.fileBase64) !== decodeURIComponent(req.params.fileName)) {
        next({status: 404, message: "File not found"})
    }

    getFile(req.params.username, base64Decode(req.params.fileBase64))
        .then((result) => {
            if (result == null) {
                next({status: 404, message: "File not found with name: " + base64Decode(req.params.fileBase64)})
                return;
            }
            let mediaType;
            try {
                mediaType = mime.lookup(result.fileName)
            } catch (err){
                mediaType = 'text/markdown'
            }
            res.set('Content-Type', mediaType)
            res.send(Buffer.from(result.content));
        })
        .catch((err) => {
            next(err);
        })
});
