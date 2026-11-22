import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import dbConnect from "@/libs/db";
import User from "@/models/User";

export const { handlers: { GET, POST }, auth } = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "github") return false;
      if (!account.providerAccountId) return false;

      try {
        await dbConnect();
        await User.findOneAndUpdate(
          { githubId: account.providerAccountId },
          {
            $set: {
              githubId: account.providerAccountId,
              username: profile.login,
              name: user.name,
              email: user.email,
              image: user.image,
            },
          },
          { upsert: true, new: true, runValidators: true }
        );
        return true;
      } catch (error) {
        console.error("GitHub sign-in error:", error);
        return false; // Return false on DB error so broken sessions aren't created
      }
    },

    // 1. Save GitHub's numeric ID onto the JWT token during sign-in
    async jwt({ token, account }) {
      if (account?.providerAccountId) {
        token.githubId = account.providerAccountId;
      }
      return token;
    },

    // 2. Expose githubId on `session.user` so your routes can read it
    async session({ session, token }) {
      if (token?.githubId) {
        session.user.githubId = token.githubId;
      }
      return session;
    },
  },
});
