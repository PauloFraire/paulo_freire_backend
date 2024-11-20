import mongoose from "mongoose";

const headerTitleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título es obligatorio"],
    minlength: [10, "El título debe tener al menos 10 caracteres"],
    maxlength: [100, "El título no puede exceder los 100 caracteres"],
    trim: true,
  },
});

const HeaderTitle = mongoose.model("HeaderTitle", headerTitleSchema);
export default HeaderTitle;
