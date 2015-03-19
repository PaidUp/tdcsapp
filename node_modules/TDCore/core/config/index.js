'user strict';

var all = {
  path:'/api/v1',
  methods: {
    POST : 'POST',
    GET : 'GET',
    PUT : 'PUT',
    DELETE : 'DELETE'
  },
  app: {
    connection: {
      urlPrefix : '/api/v1',
      isHttps: false,
      host: 'localhost',
      port: 9001,
      token:'TDUserToken-CHANGE-ME!'
    }
  }
};

module.exports = all;