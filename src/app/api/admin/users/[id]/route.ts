import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer admin-token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        credits: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Admin authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer admin-token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { plan, credits, characterLimit, voiceCloningLimit } = body;

    const updateData: any = {};
    if (plan) updateData.plan = plan;
    if (credits !== undefined) updateData.credits = parseInt(credits);
    if (characterLimit !== undefined) updateData.characterLimit = parseInt(characterLimit);
    if (voiceCloningLimit !== undefined) updateData.voiceCloningLimit = parseInt(voiceCloningLimit);

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        credits: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}