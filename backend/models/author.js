import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        unique: true
    },
    born: {
        type: Number
    },
    books: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Author'
        }
    ]
})

authorSchema.plugin(mongooseUniqueValidator);

export const Author = mongoose.model('Author', authorSchema);