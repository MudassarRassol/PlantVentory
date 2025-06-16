import mongoose from "mongoose";

const PlantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        enum : ["indoor", "outdoor" , "herb" , "tree" , "flower" , "vegetable" , " fruit" , " seeds" ],
        required : true
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reviews: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Review",
        default: [],
    },
    sold:{
        type: Number,
        default: 0
    }
},{
    timestamps : true
});

const Plant = mongoose.models.Plant || mongoose.model("Plant", PlantSchema);
export default Plant;
