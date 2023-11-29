const authMiddleware = (req, res, next) => {
    res.locals.navbaradmin = false;
    res.locals.navbarmoderator = false;
    res.locals.navbaruser = false;
  
    if (req.session.user) {
      if (req.session.user.userroleid == 1) {
        res.locals.navbaradmin = true;
      } else if (req.session.user.userroleid == 2) {
        res.locals.navbarmoderator = true;
      } else if (req.session.user.userroleid == 3) {
        res.locals.navbaruser = true;
      }
    }
  
    next();
  };
  
  module.exports = authMiddleware;
  
