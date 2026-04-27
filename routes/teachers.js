const express = require('express');
const router = express.Router();
const teachersController = require('../controllers/teachersController');
const { authenticate, teacherOnly } = require('../middleware/auth');

router.use(authenticate, teacherOnly);

router.get('/', teachersController.getAll);
router.get('/:id', teachersController.getById);
router.post('/', teachersController.create);
router.put('/:id', teachersController.update);
router.delete('/:id', teachersController.delete);

module.exports = router;
