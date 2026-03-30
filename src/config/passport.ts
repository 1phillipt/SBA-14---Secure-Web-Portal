import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import User from "../models/User.js";
import { Document, DefaultTimestampProps, Types } from "mongoose";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: process.env.GITHUB_CALLBACK_URL as string,
      scope: ["user:email"],
    },
    async (_accessToken: any, _refreshToken: any, profile: Profile, done: (arg0: Error | null, arg1: boolean | (Document<unknown, {}, { email: string; name?: string | null | undefined; password?: string | null | undefined; githubId?: string | null | undefined; } & DefaultTimestampProps, { id: string; }, { timestamps: true; }> & Omit<{ email: string; name?: string | null | undefined; password?: string | null | undefined; githubId?: string | null | undefined; } & DefaultTimestampProps & { _id: Types.ObjectId; } & { __v: number; }, "id"> & { id: string; })) => any) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email =
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : undefined;

        if (!email) {
          return done(new Error("No email found from GitHub"), false);
        }

        user = await User.findOne({ email });

        if (user) {
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = await User.create({
          name: profile.displayName || profile.username,
          email,
          githubId: profile.id,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, false);
      }
    }
  )
);

export default passport;