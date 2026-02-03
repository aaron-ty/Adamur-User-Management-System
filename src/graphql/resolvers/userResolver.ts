// src/graphql/resolvers/userResolver.ts

import { userService } from '../../services/userService';

export const userResolvers = {
  Mutation: {
    register: async (_: any, { input }: { input: { username: string; email: string; password: string } }) => {
      const { user, token, verificationOTP } = await userService.register(input.email, input.password, input.username);
      
      return {
        user, 
        token,  
        verificationOTP, 
      };
    },
    login: async (_: any, { input }: { input: { email: string; password: string } }) => {
      return userService.login(input.email, input.password);
    },
    verifyEmail: async (_: any, { otp }: { otp: string }) => {
      return userService.verifyEmail(otp);
    },
//resetpassword
    requestPasswordReset: async (_: any, { email }: { email: string }) => {
      return userService.requestPasswordReset(email);
    },
    resetPassword: async (_: any, { input }: { input: { resetToken: string; newPassword: string } }) => {
      return userService.resetPassword(input.resetToken, input.newPassword);
    },
  },
};
