const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: role tidak sesuai.' });
    }
    next();
  };
};

module.exports = authorizeRole;