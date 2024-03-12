const HttpError = require("../http.error");

const checkAdmin = (req, res, next) => {
    try {
        if (!req.userData.isAdmin) {
            throw new HttpError('Access forbidden. You are not an admin.', 403);
        }
        next(); 
    } catch (error) {
        next(error); 
    }
};

module.exports = checkAdmin;