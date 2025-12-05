import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, email, plan, amount } = body;

    // Validation
    if (!customerName || !email || !plan || !amount) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Valid plans check
    const validPlans = ['baslangic', 'icerik', 'profesyonel', 'kurumsal'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Geçersiz paket seçimi' },
        { status: 400 }
      );
    }

    // Create payment notification
    const paymentNotification = await prisma.paymentNotification.create({
      data: {
        customerName,
        email,
        plan,
        amount: parseFloat(amount),
        status: 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Ödeme bildirimi başarıyla gönderildi. En kısa sürede incelenecektir.',
      notificationId: paymentNotification.id
    });

  } catch (error) {
    console.error('Payment notification error:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}