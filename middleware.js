import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const cookie = (await cookies()).get('token'); // no need to await
  const token = cookie?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    // ✅ Correct: copy request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('userid', payload.id.toString()); // ensure it's a string

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    console.error('JWT error:', err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/api/auth/logout','/api/profile/getprofile'],
};
