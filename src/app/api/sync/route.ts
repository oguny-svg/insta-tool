import { NextRequest, NextResponse } from 'next/server';
import { getIgClient, getAllFollowers, getAllFollowing } from '@/lib/insta';

export async function POST(req: NextRequest) {
    try {
        const { sessionState, userId } = await req.json();

        if (!sessionState || !userId) {
            return NextResponse.json({ error: 'Session and User ID are required' }, { status: 400 });
        }

        const ig = await getIgClient(sessionState);

        const [followers, following] = await Promise.all([
            getAllFollowers(ig, userId),
            getAllFollowing(ig, userId)
        ]);

        const followerIds = new Set(followers.map(f => f.pk.toString()));
        const followingIds = new Set(following.map(f => f.pk.toString()));

        const unfollowers = following.filter(f => !followerIds.has(f.pk.toString()));
        const fans = followers.filter(f => !followingIds.has(f.pk.toString()));
        const mutuals = following.filter(f => followerIds.has(f.pk.toString()));

        return NextResponse.json({
            success: true,
            data: {
                followersCount: followers.length,
                followingCount: following.length,
                unfollowers,
                fans,
                mutuals
            }
        });
    } catch (error: any) {
        console.error('Sync API error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to sync with Instagram'
        }, { status: 500 });
    }
}
