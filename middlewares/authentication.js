


const { validatetoken} = require("../services/authentication")




function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        console.log("Checking for authentication cookie");
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            // No token found, so the request is not authenticated
            console.log("No authentication token found");
            return next()
        }

        try {
            const userPayload = validatetoken(tokenCookieValue);
            req.user = userPayload;
            console.log("Authentication token validated");
            return next(); // Move to the next middleware
        } catch (err) {
            console.error("Error validating authentication token:", err);
            return next()
        }
    };
}


module.exports = {
    checkForAuthenticationCookie
};