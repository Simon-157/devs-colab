const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    handle: {
        type: String,
        required: true
    },

    profileImg: {
        type: String,
        required: true,
      },

    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }]
}, {
    timestamps: true
})

const User = mongoose.model("User", UserSchema);
module.exports = User;