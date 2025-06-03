const saveToken = async (user, res, status) => {
  try {
    const token = await user.generateToken();
    res.cookie("token", token);
    const { password, ...filteredUser } = { ...user._doc };
    console.log(token);
    return res.status(status).json({
      success: true,
      user: filteredUser,
      token,
    });
  } catch (error) {
    console.log(error.message);
    console.log("Error while generating the token");
  }
};

module.exports = saveToken;
