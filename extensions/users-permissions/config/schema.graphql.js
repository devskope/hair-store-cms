const _ = require("lodash");

/**
 * Throws an ApolloError if context body contains a bad request
 * @param contextBody - body of the context object given to the resolver
 * @throws ApolloError if the body is a bad request
 */
function checkBadRequest(contextBody) {
  if (_.get(contextBody, "statusCode", 200) !== 200) {
    const message = _.get(contextBody, "error", "Bad Request");
    const exception = new Error(message);
    exception.code = _.get(contextBody, "statusCode", 400);
    exception.data = contextBody;
    throw exception;
  }
}

module.exports = {
  type: {
    UsersPermissionsPermission: false, // Make this type NOT queriable.
  },
  definition: /* GraphQL */ `
    type UsersLoginPayload {
      isAuthenticated: String!
      user: UsersPermissionsMe!
    }
  `,
  mutation: `
    signin(input: UsersPermissionsLoginInput!): UsersLoginPayload!
    signup(input: UsersPermissionsRegisterInput!): UsersLoginPayload!
    passwordReset(password: String!, passwordConfirmation: String!, code: String!): UsersLoginPayload
    confirmEmail(confirmation: String!): UsersLoginPayload
  `,
  resolver: {
    Mutation: {
      signup: {
        description: "Register a user",
        resolverOf: "plugins::users-permissions.auth.register",
        resolver: async (obj, options, { context }) => {
          context.request.body = _.toPlainObject(options.input);

          await strapi.plugins["users-permissions"].controllers.auth.register(
            context
          );
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;

          checkBadRequest(output);
          return {
            user: output.user || output,
            isAuthenticated: output.isAuthenticated,
          };
        },
      },
      signin: {
        resolverOf: "plugins::users-permissions.auth.callback",
        resolver: async (obj, options, { context }) => {
          context.params = {
            ...context.params,
            provider: options.input.provider,
          };
          context.request.body = _.toPlainObject(options.input);

          await strapi.plugins["users-permissions"].controllers.auth.callback(
            context
          );
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;

          checkBadRequest(output);
          return {
            user: output.user || output,
            isAuthenticated: output.isAuthenticated,
          };
        },
      },
      passwordReset: {
        description:
          "Reset user password. Confirm with a code (resetToken from forgotPassword)",
        resolverOf: "plugins::users-permissions.auth.resetPassword",
        resolver: async (obj, options, { context }) => {
          context.request.body = _.toPlainObject(options);

          await strapi.plugins[
            "users-permissions"
          ].controllers.auth.resetPassword(context);
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;

          checkBadRequest(output);

          return {
            user: output.user || output,
            isAuthenticated: output.isAuthenticated,
          };
        },
      },
      confirmEmail: {
        description: "Confirm an email users email address",
        resolverOf: "plugins::users-permissions.auth.emailConfirmation",
        resolver: async (obj, options, { context }) => {
          context.query = _.toPlainObject(options);

          await strapi.plugins[
            "users-permissions"
          ].controllers.auth.emailConfirmation(context, null, true);
          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;

          checkBadRequest(output);

          return {
            user: output.user || output,
            isAuthenticated: output.isAuthenticated,
          };
        },
      },
    },
  },
};
