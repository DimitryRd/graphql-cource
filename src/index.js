import { GraphQLServer } from 'graphql-yoga';

// Scalar types - String, Int, Boolean, Float, ID

// Demo user data
const users = [
  {
    id: 1,
    name: 'John',
    email: 'joe@example.com',
    age: 30,
  },
  {
    id: 2,
    name: 'Jane',
    email: 'jane@example.com',
  },
  {
    id: 3,
    name: 'George',
    email: 'george@example.com',
  },
];
const posts = [
  {
    id: 1,
    title: 'Hello',
    body: 'Voluptate aliqua   anim eu do tempor laboris.',
    published: true,
    author: 1,
  },
  {
    id: 2,
    title: 'Hello',
    body: 'Fugiat veniam reprehenderit nisi ad.',
    published: true,
    author: 1,
  },
  {
    id: 3,
    title: 'Hello',
    body: 'Laborum nulla do magna laborum quis dolore.',
    published: true,
    author: 2,
  },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    }
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, context, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, context, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
        return isBodyMatch || isTitleMatch;
      });
    },
    // add(parent, args, context, info) {
    //   return args.a + args.b;
    // },
    // addArray(parent, args, context, info) {
    //   if (args.numbers.isArray) {
    //   }
    //   return args.numbers.reduce((i, s) => {
    //     return i + s;
    //   });
    // },
    // greetings(parent, args, context, info) {
    //   console.log('greetings -> args', args);
    //   console.log('greetings -> parent', parent);
    //   console.log('greetings -> context', context);
    //   console.log('greetings -> info', info);
    //   if (args.a && args.b) {
    //     return args.a + args.b;
    //   } else {
    //     return 'Please provide figures';
    //   }
    // },
    me() {
      return {
        id: '123123',
        name: 'Dimitry',
        email: 'dimitry@gmail.com',
      };
    },
    post() {
      return {
        id: '123123',
        title: 'First post',
        body: 'First post',
        published: true,
      };
    },
  },
  Post: {
    author(parent, args, context, info) {
      console.log('author -> parent', parent);
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },
  User: {
    posts(parent, args, context, info) {
      console.log('posts -> parent', parent);
      return posts.find((post) => {
        return (post.author = parent.author);
      });
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('Server is up and running on the port 4000');
});
