import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Current session'ı al
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
    }

    // Kullanıcının güncel bilgilerini veritabanından al
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        plan: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Güncellenmiş kullanıcı bilgilerini döndür
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits,
        plan: user.plan
      }
    });

  } catch (error) {
    console.error('Session refresh error:', error);
    return NextResponse.json(
      { error: 'Session güncelleme hatası' },
      { status: 500 }
    );
  }
}