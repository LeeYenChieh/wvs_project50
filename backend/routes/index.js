import { Router } from 'express';
import UserRouter from './Users';

const router = Router();
router.use('/', UserRouter);
export default router;