// src/services/userService.ts
import { PrismaClient , User} from '@prisma/client';
import { exec } from 'child_process';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prisma = new PrismaClient();
export const userService = {
  async register(email: string, password: string, username: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();
    // Optional: Email sending logic is commented out
    // Uncomment the following lines to send the email
   
    try {
      await new Promise((resolve, reject) => {
        const t = 1
        exec(`python3 src/services/send_email.py ${email} ${verificationOTP} ${t}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${stderr}`);
            reject(new Error('Failed to send verification email'));
          }
          if (stdout.includes('Success')) {
            resolve(stdout);
          } else {
            reject(new Error('Failed to send verification email'));
          }
        });
      });
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        verificationOTP, 
        otpExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        isVerified: false,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '61717728292920202-2-2h2838383', { expiresIn: '1d' });
   // console.log(`Generated OTP for ${email}: ${verificationOTP}`);
    return {
      user,
      token,
      verificationOTP,
    };
  },

  async verifyEmail(otp: string) {
    const user = await prisma.user.findFirst({
        where: {
            verificationOTP: otp,
            otpExpiry: { gte: new Date() },
        },
    });

    //console.log("User found for OTP verification:", user); // Debug log

    if (!user) {
        throw new Error('Invalid or expired verification OTP');
    }
    await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationOTP: null,
            otpExpiry: null,
        },
    });
    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    //console.log("Updated user after verification:", updatedUser); // Debug log

    return updatedUser;
  },


  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isVerified) {
      throw new Error('Your account is not verified. Please check your email for verification instructions.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '61717728292920202-2-2h2838383', { expiresIn: '1d' });

    return {
      user,
      token,
    };
  },

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour
   // console.log("Reset token:", resetToken);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      },
    });
    // TODO: Implement email sending logic
    // await emailService.sendPasswordResetEmail(email, resetToken);
    try {
      await new Promise((resolve, reject) => {
        const t = 2
        exec(`python3 src/services/send_email.py ${email} ${resetToken} ${t}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${stderr}`);
            reject(new Error('Failed to send verification email'));
          }
          if (stdout.includes('Success')) {
            resolve(stdout);
          } else {
            reject(new Error('Failed to send verification email'));
          }
        });
      });
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
    return true;
  },
  
  async resetPassword(resetToken: string, newPassword: string): Promise<User> {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: resetToken,
        resetTokenExpiry: { gte: new Date() },
      },
    });
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    return updatedUser;
  },
};