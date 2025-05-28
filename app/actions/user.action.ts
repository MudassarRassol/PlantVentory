"use server"
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function SignUp(email: string, password: string) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    // Hash password properly
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return { 
      success: true, 
      user: { 
        id: newUser.id, 
        email: newUser.email 
      } 
    };

  } catch (error) {
    console.error('Error during sign up:', error);
    return { success: false, message: 'Sign up failed. Please try again.' };
  }
}

export async function SignIn(email: string, password: string) {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'User not found. Please sign up.' };
    }

    if (!user.password) {
      return { success: false, message: 'Password not set. Please sign up.' };
    }
    
    console.log('User found:', user.email,user.password,password);

    // Compare passwords
    const passwordMatch = bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, message: 'Invalid password. Please try again.' };
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return { 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    };

  } catch (error) {
    console.error('Error during sign in:', error);
    return { success: false, message: 'Sign in failed. Please try again.' };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token || !process.env.JWT_SECRET) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function SignOut() {

  const cookieStore = await cookies();

  cookieStore.delete('auth_token');
  return { success: true };
}
