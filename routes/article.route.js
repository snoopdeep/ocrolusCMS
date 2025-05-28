import express from "express";
const router = express.Router();
import { verifyAndRefreshToken } from "../util/authMiddleware.js";
import { createArticle,getArticles,deleteArticle,updateArticle,getArticleById,getRecentlyViewedArticles} from "../controllers/article.controller.js";

//1: create article
router.post("/", verifyAndRefreshToken, createArticle);
//2: get all articles 
router.get('/', getArticles);
//3: get my recently viewed articles
router.get('/recently-viewed',verifyAndRefreshToken,getRecentlyViewedArticles)
//4: get single article
router.get('/:id', verifyAndRefreshToken, getArticleById);
//5: delete article
router.delete('/:id',verifyAndRefreshToken,deleteArticle);
//6: update post 
router.put('/:id',verifyAndRefreshToken,updateArticle);

export default router;
