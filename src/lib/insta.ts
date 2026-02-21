import { IgApiClient, IgCheckpointError } from 'instagram-private-api';

export async function getIgClient(sessionState?: string) {
    const ig = new IgApiClient();
    if (sessionState) {
        await ig.state.deserialize(sessionState);
    }
    return ig;
}

// Global bir obje (Geçici olarak checkpoint bekleyen client'ları saklamak için)
// Not: Production'da bunu Redis veya veritabanında saklamalısınız.
const pendingClients = new Map<string, IgApiClient>();

export async function loginToInstagram(username: string, password: string) {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);

    try {
        await ig.simulate.preLoginFlow();
        const user = await ig.account.login(username, password);
        process.nextTick(async () => await ig.simulate.postLoginFlow());

        const state = await ig.state.serialize();
        return {
            success: true,
            user,
            sessionState: JSON.stringify(state),
        };
    } catch (error: any) {
        if (error instanceof IgCheckpointError) {
            // Checkpoint (Şüpheli giriş) hatası aldık
            console.log('Checkpoint required for:', username);

            // Client'ı hafızada tutalım ki kod gelince devam edebilelim
            pendingClients.set(username, ig);

            // Instagram'dan kod gönderme metodlarını alalım
            await ig.challenge.auto(true); // E-posta veya SMS'e otomatik kod gönder

            return {
                success: false,
                checkpointRequired: true,
                username,
                message: 'Instagram güvenliğiniz için bir kod gönderdi.'
            };
        }
        throw error;
    }
}

export async function verifyInstagramCode(username: string, code: string) {
    const ig = pendingClients.get(username);
    if (!ig) throw new Error('Oturum bulunamadı. Lütfen tekrar giriş yapmayı deneyin.');

    try {
        await ig.challenge.sendSecurityCode(code);
        const state = await ig.state.serialize();

        // Giriş yapan kullanıcıyı alalım
        const user = await ig.account.currentUser();

        pendingClients.delete(username);

        return {
            success: true,
            user,
            sessionState: JSON.stringify(state),
        };
    } catch (error: any) {
        console.error('Verification code error:', error);
        throw error;
    }
}

export async function getAllFollowers(ig: IgApiClient, userId: string | number) {
    const followersFeed = ig.feed.accountFollowers(userId);
    let followers: any[] = [];

    do {
        const items = await followersFeed.items();
        followers = followers.concat(items);
    } while (followersFeed.isMoreAvailable());

    return followers;
}

export async function getAllFollowing(ig: IgApiClient, userId: string | number) {
    const followingFeed = ig.feed.accountFollowing(userId);
    let following: any[] = [];

    do {
        const items = await followingFeed.items();
        following = following.concat(items);
    } while (followingFeed.isMoreAvailable());

    return following;
}
