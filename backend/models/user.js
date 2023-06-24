import mongoose from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 4,
        unique: true
    },
    favoriteGenre: {
        type: String,
        required: true
    }
})

userSchema.plugin(mongooseUniqueValidator);

export const User = mongoose.model('User', userSchema);