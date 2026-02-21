import { NextRequest, NextResponse } from 'next/server';
import { loginToInstagram, verifyInstagramCode } from '@/lib/insta';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { username, password, code } = body;

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

        let errorMessage = 'Giriş yapılamadı.';
        const rawMessage = error.message || '';
        const errorName = error.name || '';

        // Instagram'dan gelen hataya göre spesifik mesajlar
        if (errorName === 'IgLoginBadPasswordError') {
            errorMessage = 'Girdiğiniz şifre hatalı. Lütfen tekrar kontrol edin.';
        } else if (errorName === 'IgLoginInvalidUserError') {
            errorMessage = 'Böyle bir kullanıcı adı bulunamadı.';
        } else if (rawMessage.includes('block') || rawMessage.includes('spam')) {
            errorMessage = 'Instagram bu girişi engelledi (Sunucu IP engeli). Lütfen bir süre sonra tekrar deneyin.';
        } else if (rawMessage.includes('400')) {
            errorMessage = 'Instagram erişimi reddetti. Şifrenizin doğruluğundan eminseniz, telefonunuzdan Giriş Hareketlerini onaylamanız gerekebilir.';
        } else {
            errorMessage = `Hata: ${rawMessage}`;
        }

        return NextResponse.json({
            error: errorMessage,
            rawError: rawMessage
        }, { status: 401 });
    }
}
