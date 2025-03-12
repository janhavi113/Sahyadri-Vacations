import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const connection = mongoose.connection; // Get the Mongoose connection
const AutoIncrement = AutoIncrementFactory(connection); // Initialize auto-increment plugin

const MainCategoriesSectionSchema = new mongoose.Schema({
  categoryId: { type: Number, unique: true }, // Auto-incremented field
  imagePath: { type: String, required: true },
  title: { type: String, required: true },
  events: [{
    type: String
  }],
  active: { type: Boolean, default: true },
  startingPrice: { type: String, required: true },
});

// Apply the auto-increment plugin to categoryId
MainCategoriesSectionSchema.plugin(AutoIncrement, { inc_field: 'categoryId' });

export const MainCategoriesSection = mongoose.model('MainCategoriesSection', MainCategoriesSectionSchema);