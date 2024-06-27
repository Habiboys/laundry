const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
      next();
  } else {
      res.redirect('/auth/login');
  }
};
  const hasRole = (roles) => {
    return (req, res, next) => {
      if (roles.includes(req.session.userRole)) {
        next();
      } else {
        res.status(403).json({ error: 'Forbidden' });
      }
    };
  };

  const notAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        next();
    } else {
        res.redirect('/home');
    }
};

  module.exports = {
    isAuthenticated,
    notAuthenticated ,
    hasRole,

  };
  