import { NextRequest, NextResponse } from 'next/server';
import { loginToInstagram } from '@/lib/insta';

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const result = await loginToInstagram(username, password);

        // In a real app, you'd want to store this session securely (e.g., encrypted cookie)
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
    } catch (error: any) {
        console.error('Login API error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to login to Instagram'
        }, { status: 500 });
    }
}
