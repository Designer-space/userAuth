import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true });

userSchema.pre("save", async function (next) { /* before saving data run this function and the function should be written as normal function and not as arrow function  */
  if (!this.isModified('password')) { /* it checks if the current password is modified or not */
    next(); /* this means run the next middelware */
  }

  /* if not hash the password */
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const user = mongoose.model("User", userSchema);
export default user;