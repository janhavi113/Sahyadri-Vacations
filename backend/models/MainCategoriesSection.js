import mongoose from 'mongoose';

const MainCategoriesSectionSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  title: { type: String, required: true },
  events:  [{
    type: String
}],
  active: { type: Boolean, default: true },
});

const MainCategoriesSection = mongoose.model('MainCategoriesSection', MainCategoriesSectionSchema);
export default MainCategoriesSection;
