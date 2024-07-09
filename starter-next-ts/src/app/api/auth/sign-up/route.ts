import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connection from 'src/db/config';
import User from 'src/models/userModel';
import { STORAGE_KEY } from 'src/auth/context/jwt';
import { CONFIG } from 'src/config-global';

const SALT_ROUNDS = 10;
const JWT_SECRET_KEY = CONFIG.jwt.secretKey;

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, role } = await req.json();

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ msg: 'Invalid fields' }, { status: 400 });
    }

    await connection();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ msg: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const userRole = role || 'admin';
    const user = new User({ firstName, lastName, email, password: hashedPassword, role: userRole  });
    await user.save();

    const accessToken = jwt.sign({ email, firstName, role: user.role }, JWT_SECRET_KEY, { expiresIn: '3d' });

    const res = NextResponse.json(
      { msg: 'User created successfully', success: true, accessToken },
      { status: 201 }
    );
    res.cookies.set(STORAGE_KEY, accessToken, {
      httpOnly: true,
    });

    return res;
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
