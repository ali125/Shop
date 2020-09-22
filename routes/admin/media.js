const express = require('express');
const multer = require('multer');
const { viewType } = require('../../middleware/router');
const { all, add, save, update, edit, destroy } = require('../../controllers/admin/media');
const directory = './public/uploads/media';
const upload = multer({ dest: directory });
const viewRouter = express.Router();
const apiRouter = express.Router();

/* GET users listing. */
viewRouter.get('/', viewType('admin/media/list'), all);
viewRouter.get('/add', viewType('admin/media/add'), add);
viewRouter.post('/add', upload.fields([{ name: 'file', maxCount: 10 }]), viewType('admin/media/add'), save);
viewRouter.get('/:id/edit', viewType('admin/media/edit'), edit);
viewRouter.post('/:id/update', viewType('admin/media/edit'), update);
viewRouter.get('/:id/delete', viewType('admin/media/delete'), destroy);

// apiRouter.get('/', viewType(), all);
apiRouter.get('/', async (req, res, next) => {
    try {
        return res.send('Hello World')
    } catch(e) {
        return res.send({
            e: e.toString()
        })
    }
});
apiRouter.post('/', upload.fields([{ name: 'file', maxCount: 1 }]), async (req, res, next) => {
    try {
//         if(req.files.file && req.files.file[0]) {
//             const file = req.files.file[0];
//             return res.send({
//                 message: 'image',
//                 file
//             })
//         }
        return res.send(req.body.name);
        return res.send('Hello World')
    } catch(e) {
        return res.send({
            e: e.toString()
        })
    }
});
apiRouter.post('/add', upload.fields([{ name: 'file', maxCount: 1 }]), viewType(), save);
apiRouter.post('/image', upload.fields([{ name: 'file', maxCount: 1 }]), viewType(), async (req, res, next) => {
    try {
        if(req.files.file && req.files.file[0]) {
            const file = req.files.file[0];
            return res.send({
                message: 'image',
                file
            })
        } else {
            return res.send('no image')
        }

    } catch(e) {
        return res.send({
            e: e.toString()
        })
    }
});


module.exports = {
  viewRouter,
  apiRouter
};
