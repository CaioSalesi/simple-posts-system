const express = require('express');
const router = express.Router();
const studentsController = require('../controllers/studentsController');
const { authenticate, teacherOnly } = require('../middleware/auth');

router.use(authenticate, teacherOnly);

router.get('/', studentsController.getAll);
router.get('/:id', studentsController.getById);
router.post('/', studentsController.create);
router.put('/:id', studentsController.update);
router.delete('/:id', studentsController.delete);

module.exports = router;
