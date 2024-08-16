export const eventingContext = {
  exchange: {
    name: 'users_direct_exchange',
    type: 'direct',
  },

  queues: {
    userCreated: {
      name: 'user_created',
      routingKey: 'user-created',
    },
    userDeleted: {
      name: 'user_deleted',
      routingKey: 'user-deleted',
    },
  },
};
