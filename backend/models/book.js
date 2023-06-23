import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 4,
        unique: true
    },
    published: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    genres: [
        {type: String}
    ]
})

schema.plugin(mongooseUniqueValidator);

export const Book = mongoose.model('Book', bookSchema);