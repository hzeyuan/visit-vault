export default {
  router: '/ql',
  app: true, // 是否加载到 app 上,默认为 true
  agent: false, // 是否加载到 agent 上,默认为 false
  graphiql: true, // 是否加载开发者工具 playground,默认为 true
  uploads: true, // 是否开启文件上传功能，默认开启
  // 是否添加默认的 type Query,Mutation,默认为true
  // 如果为true须使用 extend type Query|extend type Mutation,因为graphql规定同一个type只能定义一个
  // 带来的好处时 egg/graphql 下不用再新建query,mutation目录
  defaultEmptySchema: true,
  introspection: true, // 是否打开内省

  // subscriptions的值为<Object>|<String>|false 见https://www.apollographql.com/docs/apollo-server/api/apollo-server/
  // 如果为String 表示订阅的路径
  // 如果为false 关闭订阅
  // 如果为object 可以添加path,keepAlive,onConnect,onDisconnect
  /* subscriptions: {
    onConnect: (connectionParams, _webSocket) => {
      console.log('connect', _webSocket);
      if (connectionParams.authToken) {
        // return validateToken(connectionParams.authToken)
        //   .then(findUser(connectionParams.authToken))
        //   .then(user => {
        //     return {
        //       currentUser: user,
        //     }
        //   })
      }
      // throw new Error('Missing auth token!')
    },
  },*/
  // 可选字段,接受项目中发生的错误,然后自定义错误返回给前端
  formatError: (error, app) => {
    // console.log(error);
    app.logger.error(error);
    return error;
  },
  debug: true, // 发生错误时,是否包含错误堆栈信息,生产环境要设置为false
};
