import express from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = express.Router();

router.post('/login', AdminController.adminLogin);

export default router;
