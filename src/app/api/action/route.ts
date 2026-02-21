import { NextRequest, NextResponse } from 'next/server';
import { getIgClient } from '@/lib/insta';

export async function POST(req: NextRequest) {
    try {
        const { sessionState, action, targetUserId } = await req.json();

        if (!sessionState || !action || !targetUserId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const ig = await getIgClient(sessionState);

        let result;
        if (action === 'unfollow') {
            result = await ig.friendship.destroy(targetUserId);
        } else if (action === 'follow') {
            result = await ig.friendship.create(targetUserId);
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            result
        });
    } catch (error: any) {
        console.error('Action API error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to perform action'
        }, { status: 500 });
    }
}
