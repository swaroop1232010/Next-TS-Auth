import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from 'src/db/config';
import User from 'src/models/userModel';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import { CONFIG } from 'src/config-global';

const JWT_SECRET_KEY = CONFIG.jwt.secretKey;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ msg: 'Email and password are required' }, { status: 400 });
    }

    await connection();

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ msg: 'Invalid email or password' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return NextResponse.json({ msg: 'Invalid email or password' }, { status: 401 });
    }

    const { firstName, role } = existingUser;
    
    const accessToken = jwt.sign({ email, firstName, role }, JWT_SECRET_KEY, { expiresIn: '3d' });

    const res = NextResponse.json(
      { msg: 'User successfully logged in', success: true, accessToken },
      { status: 200 }
    );
    res.cookies.set(STORAGE_KEY, accessToken, {
      httpOnly: true,
    });

    return res;
  } catch (error) {
    console.error('Error during sign-in:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
