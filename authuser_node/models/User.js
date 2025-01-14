// class User {
//   constructor(userID, username, passwordHash, roleID, createdAt) {
//     this.userID = userID;
//     this.username = username;
//     this.passwordHash = passwordHash;
//     this.roleID = roleID;
//     this.createdAt = createdAt;
//   }
// }

// module.exports = User;

class User {
  constructor(userID, username, email, passwordHash, roleID, createdAt) {
    this.userID = userID;
    this.username = username;
    this.email = email; 
    this.passwordHash = passwordHash;
    this.roleID = roleID;
    this.createdAt = createdAt;
  }
}

module.exports = User;