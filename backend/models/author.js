import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const authorSchema = new mongoose.Schema({
    name: {
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
    born: {
        type: Number
    }
})

schema.plugin(mongooseUniqueValidator);

export const Author = mongoose.model('Author', authorSchema);