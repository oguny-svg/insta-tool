import { NextRequest, NextResponse } from 'next/server';
import { loginToInstagram, verifyInstagramCode } from '@/lib/insta';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password, code } = body;

        // Eğer kod gelmişse doğrulamaya git
        if (code && username) {
            const result = await verifyInstagramCode(username, code);
            return NextResponse.json({
                success: true,
                user: {
                    pk: result.user.pk,
                    username: result.user.username,
                    full_name: result.user.full_name,
                    profile_pic_url: result.user.profile_pic_url,
                },
                sessionState: result.sessionState
            });
        }

        // İlk giriş denemesi
        if (!username || !password) {
            return NextResponse.json({ error: 'Kullanıcı adı ve şifre gereklidir.' }, { status: 400 });
        }

        const result = await loginToInstagram(username, password);

        if (result.checkpointRequired) {
            return NextResponse.json({
                success: false,
                checkpointRequired: true,
                message: result.message,
                username: result.username
            });
        }

        return NextResponse.json({
            success: true,
            user: {
                pk: result.user?.pk,
                username: result.user?.username,
                full_name: result.user?.full_name,
                profile_pic_url: result.user?.profile_pic_url,
            },
            sessionState: result.sessionState
        });

    } catch (error: any) {
        console.error('Login API error:', error);

        let errorMessage = 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.';
        const rawMessage = error.message || '';

        if (rawMessage.includes('Bad Request') || rawMessage.includes('400')) {
            errorMessage = 'Hatalı kullanıcı adı veya şifre veya Instagram erişimi reddetti.';
        } else if (rawMessage.includes('code') || rawMessage.includes('verify')) {
            errorMessage = 'Doğrulama kodu hatalı veya süresi dolmuş.';
        }

        return NextResponse.json({
            error: errorMessage,
            rawError: rawMessage
        }, { status: 401 });
    }
}
