import mongoose from "mongoose";

const reviewschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plant",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
},{
    timestamps : true
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewschema);
export default Review;
