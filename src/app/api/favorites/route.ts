import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcının favorilerini getir
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      favorites
    });

  } catch (error: any) {
    console.error('Favorites GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Favorilere ses ekle
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { voiceId, voiceName } = body;

    if (!voiceId || !voiceName) {
      return NextResponse.json(
        { success: false, error: 'Voice ID and name are required' },
        { status: 400 }
      );
    }

    // Zaten favorilerde var mı kontrol et
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_voiceId: {
          userId: session.user.id,
          voiceId: voiceId
        }
      }
    });

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: 'Voice already in favorites' },
        { status: 409 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        voiceId,
        voiceName
      }
    });

    return NextResponse.json({
      success: true,
      favorite
    });

  } catch (error: any) {
    console.error('Favorites POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Favorilerden ses çıkar
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const voiceId = searchParams.get('voiceId');

    if (!voiceId) {
      return NextResponse.json(
        { success: false, error: 'Voice ID is required' },
        { status: 400 }
      );
    }

    const deletedFavorite = await prisma.favorite.delete({
      where: {
        userId_voiceId: {
          userId: session.user.id,
          voiceId: voiceId
        }
      }
    });

    return NextResponse.json({
      success: true,
      deletedFavorite
    });

  } catch (error: any) {
    console.error('Favorites DELETE Error:', error);
    
    if (error.code === 'P2025') { // Record not found
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}