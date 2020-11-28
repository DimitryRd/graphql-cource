import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar types - String, Int, Boolean, Float, ID

// Demo user data
const users = [
  {
    id: '1',
    name: 'John',
    email: 'joe@example.com',
    age: 30,
  },
  {
    id: '2',
    name: 'Jane',
    email: 'jane@example.com',
  },
  {
    id: '3',
    name: 'George',
    email: 'george@example.com',
  },
];

const posts = [
  {
    id: '1',
    title: 'Hello',
    body: 'Voluptate aliqua anim eu do tempor laboris.',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'Hello',
    body: 'Fugiat veniam reprehenderit nisi ad.',
    published: true,
    author: '1',
  },
  {
    id: '3',
    title: 'Hello',
    body: 'Laborum nulla do magna laborum quis dolore.',
    published: true,
    author: '2',
  },
];

const comments = [
  {
    id: '1',
    text: 'qureto novellare, ancora potendo io infiniti quali raccontare piú nel noi. Quella ma non forza.',
    author: '1',
    post: '1',
  },
  {
    id: '2',
    text: 'Sed est aliquyam at invidunt et. Eos at sit tempor kasd labore voluptua est kasd',
    author: '2',
    post: '2',
  },
  {
    id: '3',
    text: 'Les peaux-rouges neiges et verte les. Golfes de heurté bleme verte si. Béni les.',
    author: '1',
    post: '2',
  },
  {
    id: '4',
    text: 'Ut diam dolore eirmod diam amet ipsum, et sit sed duo labore consetetur et sadipscing e',
    author: '3',
    post: '2',
  },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }
    type Mutation {
        createUser(data: CreateUserInput): User!
        createPost(data: CreatePostInput): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
      name: String!,
      email: String!,
      age: Int
    }

    input CreatePostInput {
      title: String!,
      body: String!,
      published: Boolean,
      author: ID!
    }

    input CreateCommentInput {
      text: String!,
      author: ID!,
      post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comment: [Comment!]!
    }
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, context, info) {
      console.log('🚀 ~ file: index.js ~ line 119 ~ users ~ args', args);
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
    comments(parent, args, context, info) {
      if (!args.query) {
        return comments;
      }
    },
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
        author: '1',
      };
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error('Email taken.');
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, context, info) {
      const userExist = users.some((user) => user.id === args.data.author);

      if (!userExist) {
        throw new Error('User is not exist');
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, context, info) {
      const postExist = posts.some((post) => post.id === args.data.post && post.published);
      const userExist = users.some((user) => user.id === args.data.author);

      if (!postExist || !userExist) {
        throw new Error('Unable to process the comment');
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      };

      comments.push(comment);

      return comment;
    },
  },
  Post: {
    author(parent, args, context, info) {
      return users.find((user) => user.id === parent.author);
    },
    comment(parent, args, context, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  User: {
    posts(parent, args, context, info) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, context, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, context, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, context, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start(() => {
  console.log('Server is up and running on the port 4000');
});
