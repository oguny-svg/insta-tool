import { IgApiClient } from 'instagram-private-api';

export async function getIgClient(sessionState?: string) {
    const ig = new IgApiClient();

    if (sessionState) {
        await ig.state.deserialize(sessionState);
    }

    return ig;
}

export async function loginToInstagram(username: string, password: string) {
    const ig = new IgApiClient();
    ig.state.generateDevice(username);

    try {
        await ig.simulate.preLoginFlow();
        const user = await ig.account.login(username, password);
        process.nextTick(async () => await ig.simulate.postLoginFlow());

        const state = await ig.state.serialize();
        delete (state as any).constants; // Optional: Clean up state if needed

        return {
            user,
            sessionState: JSON.stringify(state),
        };
    } catch (error: any) {
        console.error('Instagram login error:', error);
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
