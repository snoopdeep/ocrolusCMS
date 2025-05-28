import express from 'express';
const router = express.Router();
import { signup } from '../controllers/auth.controller.js';


//1: signup
router.post('/signup',signup) 


export default router;