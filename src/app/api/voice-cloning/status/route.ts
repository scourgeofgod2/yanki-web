import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import {
  Logger,
  createErrorResponse,
  createSuccessResponse,
  generateRequestId,
  getClientIP
} from '@/lib/validation';

// Voice cloning status kontrolü için GET endpoint
export async function GET(request: NextRequest) {
  const requestId = generateRequestId();
  const clientIP = getClientIP(request);
  
  try {
    // Session kontrolü
    const session = await auth();
    if (!session?.user?.id) {
      Logger.warn('Yetkisiz voice cloning status denemesi', { requestId, clientIP });
      return NextResponse.json(
        createErrorResponse('Oturum açmanız gerekiyor.', 'UNAUTHORIZED', undefined, undefined, requestId),
        { status: 401 }
      );
    }

    // Query parameter'den requestId al
    const { searchParams } = new URL(request.url);
    const cloneRequestId = searchParams.get('requestId');

    if (!cloneRequestId) {
      return NextResponse.json(
        createErrorResponse('RequestId parametresi gerekli.', 'VALIDATION_ERROR', 'requestId', undefined, requestId),
        { status: 400 }
      );
    }

    Logger.info('Voice cloning status kontrol ediliyor', {
      requestId,
      cloneRequestId,
      userId: session.user.id
    });

    // ClonedVoice tablosundan klonlama durumunu kontrol et
    const clonedVoice = await prisma.clonedVoice.findFirst({
      where: {
        id: cloneRequestId,
        userId: session.user.id // Güvenlik için user check
      }
    });

    if (!clonedVoice) {
      // Henüz işlem başlamamış olabilir - starting durumu döndür
      Logger.info('Voice clone kaydı henüz oluşturulmamış', {
        requestId,
        cloneRequestId,
        userId: session.user.id
      });
      
      return NextResponse.json(
        createSuccessResponse({
          status: 'starting',
          progress: 10,
          message: 'Ses klonlama işlemi başlatılıyor...',
          voice_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      );
    }

    // Eğer processing durumundaysa ve voiceId boşsa, bu bir frontend polling kaydıdır
    // Bu durumda simüle edilmiş progress döndürelim
    if (clonedVoice.status === 'processing' && !clonedVoice.voiceId) {
      // Kaç dakika önce oluşturulmuş kontrol et
      const now = new Date();
      const createdAt = new Date(clonedVoice.createdAt);
      const elapsedMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
      
      let progress: number;
      let status: string = 'processing';
      let message: string = 'Ses klonlama işlemi devam ediyor...';
      
      // Simüle edilmiş progress
      if (elapsedMinutes < 1) {
        progress = 20;
        message = 'Ses dosyanız işleniyor...';
      } else if (elapsedMinutes < 2) {
        progress = 40;
        message = 'Ses karakteristiği analiz ediliyor...';
      } else if (elapsedMinutes < 3) {
        progress = 60;
        message = 'Yapay zeka modeli eğitiliyor...';
      } else if (elapsedMinutes < 4) {
        progress = 80;
        message = 'Son işlemler yapılıyor...';
      } else {
        // 4 dakika sonra completed olarak güncelle (demo için)
        // Gerçek sistemde burada external API check edilmeli
        try {
          const updatedVoice = await prisma.clonedVoice.update({
            where: { id: clonedVoice.id },
            data: { 
              status: 'completed',
              voiceId: `demo_voice_${clonedVoice.id}` // Demo voice ID
            }
          });
          
          return NextResponse.json(
            createSuccessResponse({
              status: 'completed',
              progress: 100,
              message: 'Ses klonlama başarıyla tamamlandı!',
              voice_id: updatedVoice.voiceId,
              created_at: clonedVoice.createdAt,
              updated_at: updatedVoice.updatedAt
            })
          );
        } catch (updateError) {
          Logger.error('ClonedVoice update hatası', { requestId, error: updateError });
          progress = 90;
          message = 'İşlem tamamlanıyor...';
        }
      }
      
      return NextResponse.json(
        createSuccessResponse({
          status,
          progress,
          message,
          voice_id: null,
          created_at: clonedVoice.createdAt,
          updated_at: clonedVoice.updatedAt
        })
      );
    }

    // Normal status mapping (tamamlanmış veya başarısız işlemler için)
    let apiStatus: string;
    let progress: number;
    
    switch (clonedVoice.status) {
      case 'processing':
        apiStatus = 'processing';
        progress = 50;
        break;
      case 'completed':
        apiStatus = 'completed';
        progress = 100;
        break;
      case 'failed':
        apiStatus = 'failed';
        progress = 0;
        break;
      default:
        apiStatus = 'processing';
        progress = 25;
    }

    // Status ve progress bilgilerini dön
    const responseData = {
      status: apiStatus,
      progress: progress,
      message: getStatusMessage(apiStatus),
      voice_id: clonedVoice.status === 'completed' ? clonedVoice.voiceId : null,
      created_at: clonedVoice.createdAt,
      updated_at: clonedVoice.updatedAt
    };

    Logger.info('Voice cloning status döndürüldü', {
      requestId,
      cloneRequestId,
      status: apiStatus,
      progress: progress,
      elapsedTime: clonedVoice.status === 'processing' ? `${Math.round((new Date().getTime() - new Date(clonedVoice.createdAt).getTime()) / 1000 / 60)} dakika` : undefined
    });

    return NextResponse.json(
      createSuccessResponse(responseData)
    );

  } catch (error) {
    Logger.error('Voice cloning status API hatası', {
      requestId,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      createErrorResponse('Status kontrolü sırasında hata oluştu.', 'SERVER_ERROR', undefined, undefined, requestId),
      { status: 500 }
    );
  }
}

// Status mesajlarını dön
function getStatusMessage(status: string): string {
  switch (status) {
    case 'starting':
      return 'Ses klonlama başlatılıyor...';
    case 'processing':
      return 'Ses klonlama işlemi devam ediyor...';
    case 'completed':
      return 'Ses klonlama başarıyla tamamlandı!';
    case 'failed':
      return 'Ses klonlama işlemi başarısız oldu.';
    default:
      return 'Durum bilinmiyor.';
  }
}
