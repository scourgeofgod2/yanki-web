import { NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Kullanıcının TTS geçmişini al
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Oturum gerekli.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Toplam kayıt sayısını al
    const totalCount = await prisma.history.count({
      where: { userId: session.user.id }
    });

    // History kayıtlarını al
    const histories = await prisma.history.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      skip: skip,
      take: limit,
      select: {
        id: true,
        text: true,
        voiceId: true,
        emotion: true,
        language: true,
        characterCount: true,
        audioUrl: true,
        status: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        histories,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error: any) {
    console.error('History GET API Hatası:', error.message);
    return NextResponse.json(
      { success: false, error: 'Geçmiş kayıtları alınamadı.' }, 
      { status: 500 }
    );
  }
}

// DELETE: Belirli bir history kaydını sil
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: 'Oturum gerekli.' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const historyId = searchParams.get('id');

    if (!historyId) {
      return NextResponse.json({ success: false, error: 'History ID gerekli.' }, { status: 400 });
    }

    // Önce kaydın kullanıcıya ait olduğunu doğrula
    const historyRecord = await prisma.history.findFirst({
      where: {
        id: historyId,
        userId: session.user.id
      }
    });

    if (!historyRecord) {
      return NextResponse.json({ success: false, error: 'Kayıt bulunamadı veya size ait değil.' }, { status: 404 });
    }

    // Kaydı sil
    await prisma.history.delete({
      where: { id: historyId }
    });

    return NextResponse.json({
      success: true,
      message: 'Kayıt başarıyla silindi.'
    });

  } catch (error: any) {
    console.error('History DELETE API Hatası:', error.message);
    return NextResponse.json(
      { success: false, error: 'Kayıt silinemedi.' }, 
      { status: 500 }
    );
  }
}