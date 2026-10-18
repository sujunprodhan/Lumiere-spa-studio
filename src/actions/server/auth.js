'use server';

import { collections, dbConnect } from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

export async function registerUser({ name, email, password }) {
  try {
    if (!name || !email || !password) {
      return { success: false, message: 'Please provide all required fields.' };
    }

    if (password.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userCollection = dbConnect(collections.USERS);

    const existingUser = await userCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    };

    const result = await userCollection.insertOne(newUser);

    return {
      success: true,
      message: 'Account created successfully! Welcome to Lumiere.',
      userId: result.insertedId.toString(),
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An error occurred during registration. Please try again.',
    };
  }
}

export async function loginUser({ email, password }) {
  try {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userCollection = dbConnect(collections.USERS);

    const user = await userCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return { success: false, message: 'No account found with this email address.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    return {
      success: true,
      message: 'Welcome back to Lumiere!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during sign in. Please try again.',
    };
  }
}
