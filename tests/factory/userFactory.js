const mongoose = require("mongoose");
const User = mongoose.model("User");
module.exports = () => {
	return new User({}).save();
};

// module.exports = async () => {
// 	const user = new User({});
// 	await user.save();
// };
