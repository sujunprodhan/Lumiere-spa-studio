import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { collections, dbConnect } from '@/lib/dbConnect';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password.');
        }

        const normalizedEmail = credentials.email.toLowerCase().trim();
        const userCollection = dbConnect(collections.USERS);
        const user = await userCollection.findOne({ email: normalizedEmail });

        if (!user) {
          throw new Error('No user found with this email address.');
        }

        if (!user.password) {
          throw new Error('This account was created via social login. Please sign in with Google/GitHub.');
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordMatch) {
          throw new Error('Incorrect password. Please try again.');
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role || 'user',
        };
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const userCollection = dbConnect(collections.USERS);
          const normalizedEmail = user.email?.toLowerCase().trim();
          const existingUser = await userCollection.findOne({ email: normalizedEmail });

          if (!existingUser) {
            const insertResult = await userCollection.insertOne({
              name: user.name || 'User',
              email: normalizedEmail,
              image: user.image || '',
              provider: account.provider,
              role: 'user',
              createdAt: new Date(),
            });
            user.id = insertResult.insertedId.toString();
            user.role = 'user';
          } else {
            user.id = existingUser._id.toString();
            user.role = existingUser.role || 'user';
          }
        } catch (error) {
          console.error('Error syncing social user to DB:', error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      } else if (!token.role && token.email) {
        try {
          const userCollection = dbConnect(collections.USERS);
          const dbUser = await userCollection.findOne({ email: token.email.toLowerCase().trim() });
          if (dbUser) {
            token.id = dbUser._id.toString();
            token.role = dbUser.role || 'user';
          }
        } catch (error) {
          console.error('Error attaching role to token:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'user';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
