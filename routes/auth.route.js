import express from 'express';
const router = express.Router();
import { signin, signup } from '../controllers/auth.controller.js';

//1: signup
router.post('/signup',signup) 
//2: signin
router.post('/signin',signin);

export default router;