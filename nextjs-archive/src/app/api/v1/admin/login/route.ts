import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';


export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // TEMPORARY: Allow first login to auto-create admin if none exists
    const adminCount = await prisma.adminUser.count();
    let admin = await prisma.adminUser.findUnique({ where: { email } });
    
    if (adminCount === 0 && email === process.env.ADMIN_EMAIL) {
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await prisma.adminUser.create({
        data: { email, password: hashedPassword }
      });
    }

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const session = await encrypt({ id: admin.id, email: admin.email });
    cookies().set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
