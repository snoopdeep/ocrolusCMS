import Article from "../models/article.model.js";
import RecentlyViewed from "../models/user_view.model.js";
import { errorHandler } from "../util/errorHandler.js";
import mongoose from "mongoose";

// Helper function to update recently viewed
const updateRecentlyViewed = async (userId, articleId) => {
  try {
    // find or create recently viewed document for user
    let recentlyViewed = await RecentlyViewed.findOne({ user_id: userId });
    
    if (!recentlyViewed) {
      // create new document if doesn't exist
      recentlyViewed = new RecentlyViewed({
        user_id: userId,
        recently_viewed: [{
          article_id: articleId,
          viewed_at: new Date()
        }]
      });
    } else {
      // remove existing entry if present (to avoid duplicates)
      recentlyViewed.recently_viewed = recentlyViewed.recently_viewed.filter(
        item => item.article_id.toString() !== articleId.toString()
      );
      // add new entry at the beginning
      recentlyViewed.recently_viewed.unshift({
        article_id: articleId,
        viewed_at: new Date()
      });
      
      // keep only last 10 viewed articles
      if (recentlyViewed.recently_viewed.length > 10) {
        recentlyViewed.recently_viewed = recentlyViewed.recently_viewed.slice(0, 10);
      }
    }
    
    await recentlyViewed.save();
  } catch (error) {
    console.error('Error updating recently viewed:', error);
  }
};

//1: create article
export const createArticle = async (req, res, next) => {
  // console.log('hi, createArticle');
  try {
    // console.log('createArticle',req.user);
    const { document_type, title, summary, content } = req.body;
    //validate the req.body content
    if (!document_type || !title || !summary || !content) {
      return next(errorHandler(400, "All fields are required"));
    }
    if (
      !content.average_monthly_balance ||
      !content.monthly_deposits ||
      !content.cash_flow_score ||
      !content.recommended_loan_amount
    ) {
      return next(errorHandler(400, "All content fields are required"));
    }
     // Check if article already exists
    const existingArticle = await Article.findOne({ title });
    if (existingArticle) {
      return next(errorHandler(400, "Article with this title already exists"));
    }
    // create new article 
    const article = await Article.create({
      author_id: req.user.id,
      document_type,
      title:title.toLowerCase(),
      summary,
      content,
    });

    res.status(201).json({
      message: "Article created successfully",
      article,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// 2: Get all articles
export const getArticles = async (req, res, next) => {
  // console.log('hi, getArticles');
  try {
    // Execute the query with pagination and sorting
    const articles = await Article.find()
      .populate('author_id', 'userName fullName email');

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
    
  } catch (err) {
    next(err);
  }
};

//3: delete Article
export const deleteArticle = async (req, res, next) => {
  // console.log('hi, deleteArticle');
  try {
    const { id } = req.params;
    // Validate the ID 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Invalid article ID"));
    }
    // Find the article
    const article = await Article.findById(id);
    // Check if article exists
    if (!article) {
      return next(errorHandler(404, "Article not found"));
    }
    // Check if user is the author, only author can delete
    if (article.author_id.toString() !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to delete this article."));
    }
    // Delete the article
    await Article.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Article deleted successfully"
    });

  } catch (err) {
    console.log(err);
    next(err);
  }
};
// 4: update article
export const updateArticle = async (req, res, next) => {
  // console.log('hi, updateArticle');
  try {
    const { id } = req.params;
    const { document_type, title, summary, content } = req.body;
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Invalid article ID"));
    }

    // Find the article
    const article = await Article.findById(id);
    
    // check for existing article
    if (!article) {
      return next(errorHandler(404, "Article not found"));
    }

    // Check if user is the author or admin
    if (article.author_id.toString() !== req.user.id) {
      return next(errorHandler(403, "You can only update your own articles"));
    }
    // Prepare update object
    const updateData = {};
    if (document_type) updateData.document_type = document_type;
    if (title) updateData.title = title;
    if (summary) updateData.summary = summary;
    if (content) {
      const contentFields = [
        'average_monthly_balance',
        'monthly_deposits',
        'cash_flow_score',
        'recommended_loan_amount'
      ];
      // check for invalid fields
      const invalidFields = Object.keys(content).filter(
        field => !contentFields.includes(field)
      );
      if (invalidFields.length > 0) {
        return next(errorHandler(400, `Invalid content fields: ${invalidFields.join(', ')}`));
      }
      // add content to update data
      updateData.content = content;
    }
    // Update the article
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // return updated doc and run validators
    );

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      article: updatedArticle
    });

  } catch (err) {
    //mongodb validation error
    if (err.code === 11000) {
      return next(errorHandler(400, "Article with this title already exists"));
    }
    console.log(err);
    next(err);
  }
};

// 5: get single article with view tracking
export const getArticleById = async (req, res, next) => {
  // console.log('hi, getArticleById ');
  try {
    const { id } = req.params;
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(errorHandler(400, "Invalid article ID"));
    }
    // Find the article
    const article = await Article.findById(id)
      .populate('author_id', 'userName fullName email');

    if (!article) {
      return next(errorHandler(404, "Article not found"));
    }
    // Update recently viewed for authenticated user
    if (req.user) {
      await updateRecentlyViewed(req.user.id, id);
    }

    res.status(200).json({
      success: true,
      data: article
    });
    
  } catch (err) {
    next(err);
  }
};

// 6: get recently viewed articles
export const getRecentlyViewedArticles = async (req, res, next) => {
  // console.log('hi, getRecentlyViewedArticles');
  try {
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "User not authenticated"));
    }
    const userId = req.user.id;
    // validate the user ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(errorHandler(400, "Invalid user ID format"));
    }
    // recently viewed articles for the user
    const recentlyViewedData = await RecentlyViewed.findOne({ user_id: userId })
      .populate({
        path: 'recently_viewed.article_id',
        select: 'title summary document_type author_id createdAt',
        populate: {
          path: 'author_id',
          select: 'userName fullName'
        }
      });
    // If no recently viewed data exists or empty array
    if (!recentlyViewedData || !recentlyViewedData.recently_viewed || recentlyViewedData.recently_viewed.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No recently viewed articles found",
        count: 0,
        data: []
      });
    }
    // Filter out any articles with null article_id
    const validArticles = recentlyViewedData.recently_viewed.filter(
      item => item.article_id !== null
    );
    // Sort by viewed_at in descending order (most recent first)
    const sortedArticles =validArticles.sort(
      (a, b) => new Date(b.viewed_at) - new Date(a.viewed_at)
    );

    res.status(200).json({
      success: true,
      count: sortedArticles.length,
      data: sortedArticles
    });

  } catch (err) {
    console.log('Error in getRecentlyViewedArticles:', err);
    next(err);
  }
};