import { NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Kullanıcı bilgilerini al
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Oturum gerekli.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        plan: true,
        createdAt: true,
        _count: {
          select: {
            history: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        totalGenerations: user._count.history
      }
    });

  } catch (error: any) {
    console.error('User GET API Hatası:', error.message);
    return NextResponse.json(
      { success: false, error: 'Kullanıcı bilgileri alınamadı.' }, 
      { status: 500 }
    );
  }
}

// PUT: Kullanıcı bilgilerini güncelle
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Oturum gerekli.' }, { status: 401 });
    }

    const body = await req.json();
    const { name, plan, credits } = body;

    // Güvenlik: Sadece name güncellenmesine izin ver (plan ve credits admin işi)
    const updateData: any = {};
    if (name && typeof name === 'string') {
      updateData.name = name.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, error: 'Güncellenecek veri bulunamadı.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        credits: true,
        plan: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profil başarıyla güncellendi.'
    });

  } catch (error: any) {
    console.error('User PUT API Hatası:', error.message);
    return NextResponse.json(
      { success: false, error: 'Profil güncellenemedi.' }, 
      { status: 500 }
    );
  }
}