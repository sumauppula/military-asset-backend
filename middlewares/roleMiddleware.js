// Map role IDs to role names — or fetch from DB in real app
const roleNames = {
  1: 'Admin',
  2: 'Base Commander',
  3: 'Logistics Officer',
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoleId = req.user.role_id;
    const userRole = roleNames[userRoleId];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = authorizeRoles;
