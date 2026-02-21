export interface InstagramUser {
  pk: number | string;
  username: string;
  full_name: string;
  profile_pic_url: string;
  is_private: boolean;
  is_verified: boolean;
  relationship?: {
    following: boolean;
    followed_by: boolean;
  };
}

export interface SyncResult {
  followers: InstagramUser[];
  following: InstagramUser[];
  unfollowers: InstagramUser[];
  fans: InstagramUser[];
  mutuals: InstagramUser[];
}
