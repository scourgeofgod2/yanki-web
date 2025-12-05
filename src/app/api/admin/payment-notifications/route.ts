import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Admin authentication check (should be improved with proper JWT)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer admin-token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where = status ? { status } : {};
    
    const [notifications, total] = await Promise.all([
      prisma.paymentNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.paymentNotification.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin payment notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Admin authentication check
    const authHeader = request.headers.get('authorization');
    if (!authHeader || authHeader !== 'Bearer admin-token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      adminNotes,
      updatedAt: new Date()
    };

    if (status === 'approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'rejected') {
      updateData.rejectedAt = new Date();
    }

    const notification = await prisma.paymentNotification.update({
      where: { id },
      data: updateData
    });

    // If approved, update user's plan automatically
    if (status === 'approved') {
      try {
        // Plan configuration mapping
        const planConfigs = {
          'baslangic': {
            characterLimit: 30000,
            voiceCloningLimit: 5,
            subscriptionDuration: 30 // days
          },
          'icerik': {
            characterLimit: 100000,
            voiceCloningLimit: 10,
            subscriptionDuration: 30
          },
          'profesyonel': {
            characterLimit: 250000,
            voiceCloningLimit: 20,
            subscriptionDuration: 30
          },
          'kurumsal': {
            characterLimit: 2000000,
            voiceCloningLimit: 50,
            subscriptionDuration: 30
          }
        };

        const config = planConfigs[notification.plan as keyof typeof planConfigs];
        if (config) {
          // Calculate subscription expiry date
          const subscriptionExpires = new Date();
          subscriptionExpires.setDate(subscriptionExpires.getDate() + config.subscriptionDuration);

          // Update user plan
          await prisma.user.updateMany({
            where: { email: notification.email },
            data: {
              plan: notification.plan,
              characterLimit: config.characterLimit,
              voiceCloningLimit: config.voiceCloningLimit,
              subscriptionExpires,
              usedCharacters: 0, // Reset usage
              credits: config.characterLimit // Reset credits
            }
          });

          console.log(`User plan updated for ${notification.email}: ${notification.plan}`);
        }
      } catch (error) {
        console.error('Error updating user plan:', error);
        // Continue despite user update error
      }
    }

    return NextResponse.json({
      success: true,
      data: notification
    });

  } catch (error) {
    console.error('Admin payment notification update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}