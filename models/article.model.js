import mongoose from 'mongoose';

// Article Schema
const articleSchema = new mongoose.Schema(
  {
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //references the User model
      required: true,
    },
    document_type: {
      type: String,
      enum: ['bank_statement', 'pay_stub', 'tax_return'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique:true,
      trim: true,
      lowercase: true
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      average_monthly_balance: {
        type: Number,
        required: true,
        min: 0,
      },
      monthly_deposits: {
        type: [Number],
        required: true,
        validate: {
          validator: (arr) => arr.every((num) => num >= 0),
          message: 'Monthly deposits must be non-negative numbers',
        },
      },
      cash_flow_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      recommended_loan_amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  },
  {
    timestamps:true
  }
);

const Article = mongoose.model('Article', articleSchema);
export default Article;