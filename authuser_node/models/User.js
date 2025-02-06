class User {
  constructor(userID, username, email, passwordHash, roleName, createdAt) {
    this.userID = userID;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.roleName = roleName;
    this.createdAt = createdAt;
  }
}

module.exports = User;
