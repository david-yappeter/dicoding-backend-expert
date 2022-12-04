const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const TokenTestHelper = {
  async getAccessToken(owner = 'user-12345', username = 'junedoe') {
    const payloadUser = {
      id: owner,
      username,
      password: '123533',
      fullname: `June Doe-${new Date().getTime().toString()}`,
    };
    await UsersTableTestHelper.addUser(payloadUser);
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = TokenTestHelper;
