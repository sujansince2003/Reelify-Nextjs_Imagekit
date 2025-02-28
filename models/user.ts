import bcrypt from "bcryptjs";
import mongoose, { Schema, model, models } from "mongoose";

export interface Iuser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<Iuser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Adding a mongoose pre-save hook  to hash the password before saving to the database
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Check if the model already exists in the 'models' object (prevents overwriting the model)
// If it doesn't exist, create a new model based on the 'userSchema'
const User = models?.User || model<Iuser>("User", userSchema);

export default User;
