import { DataAPIClient } from "@datastax/astra-db-ts";
import { env } from "~/env.mjs"

type Post = {
  post_id: string;
  post_type: "reel" | "carousel" | "static";
  likes: number;
  shares: number;
  comments: number;
  timestamp: string;
};

async function analyzeSocialMediaData() {
  const client = new DataAPIClient(env.ASTRA_DB_TOKEN);
  const db = client.db(env.ASTRA_DB_URL);

  try {
    const collection = db.collection("social_media");
    const documents = await collection.find({}).toArray();

    // Parse CSV content from all documents into Post objects
    const allPosts: Post[] = documents.flatMap(doc => {
      // Skip header row if present
      const rows = doc.content.split('\n').filter((row: string) => row.trim() && !row.startsWith('post_id'));

      return rows.map((row) => {
        const [post_id, post_type, likes, shares, comments, timestamp] = row.split(',');
        return {
          post_id,
          post_type: post_type as "reel" | "carousel" | "static",
          likes: parseInt(likes),
          shares: parseInt(shares),
          comments: parseInt(comments),
          timestamp
        };
      });
    });

    // Calculate analytics
    const analytics = {
      totalPosts: allPosts.length,
      postTypeBreakdown: {
        reels: allPosts.filter(p => p.post_type === 'reel').length,
        carousels: allPosts.filter(p => p.post_type === 'carousel').length,
        static: allPosts.filter(p => p.post_type === 'static').length
      },
      engagement: {
        totalLikes: allPosts.reduce((sum, post) => sum + post.likes, 0),
        totalShares: allPosts.reduce((sum, post) => sum + post.shares, 0),
        totalComments: allPosts.reduce((sum, post) => sum + post.comments, 0),
        avgLikesPerPost: Math.round(allPosts.reduce((sum, post) => sum + post.likes, 0) / allPosts.length),
        avgSharesPerPost: Math.round(allPosts.reduce((sum, post) => sum + post.shares, 0) / allPosts.length),
        avgCommentsPerPost: Math.round(allPosts.reduce((sum, post) => sum + post.comments, 0) / allPosts.length)
      },
      performanceByType: {
        reel: {
          avgLikes: Math.round(allPosts.filter(p => p.post_type === 'reel').reduce((sum, post) => sum + post.likes, 0) / allPosts.filter(p => p.post_type === 'reel').length),
          avgShares: Math.round(allPosts.filter(p => p.post_type === 'reel').reduce((sum, post) => sum + post.shares, 0) / allPosts.filter(p => p.post_type === 'reel').length),
          avgComments: Math.round(allPosts.filter(p => p.post_type === 'reel').reduce((sum, post) => sum + post.comments, 0) / allPosts.filter(p => p.post_type === 'reel').length)
        },
        carousel: {
          avgLikes: Math.round(allPosts.filter(p => p.post_type === 'carousel').reduce((sum, post) => sum + post.likes, 0) / allPosts.filter(p => p.post_type === 'carousel').length),
          avgShares: Math.round(allPosts.filter(p => p.post_type === 'carousel').reduce((sum, post) => sum + post.shares, 0) / allPosts.filter(p => p.post_type === 'carousel').length),
          avgComments: Math.round(allPosts.filter(p => p.post_type === 'carousel').reduce((sum, post) => sum + post.comments, 0) / allPosts.filter(p => p.post_type === 'carousel').length)
        },
        static: {
          avgLikes: Math.round(allPosts.filter(p => p.post_type === 'static').reduce((sum, post) => sum + post.likes, 0) / allPosts.filter(p => p.post_type === 'static').length),
          avgShares: Math.round(allPosts.filter(p => p.post_type === 'static').reduce((sum, post) => sum + post.shares, 0) / allPosts.filter(p => p.post_type === 'static').length),
          avgComments: Math.round(allPosts.filter(p => p.post_type === 'static').reduce((sum, post) => sum + post.comments, 0) / allPosts.filter(p => p.post_type === 'static').length)
        }
      },
      // Find top performing posts
      topPosts: {
        byLikes: [...allPosts].sort((a, b) => b.likes - a.likes).slice(0, 5),
        byShares: [...allPosts].sort((a, b) => b.shares - a.shares).slice(0, 5),
        byComments: [...allPosts].sort((a, b) => b.comments - a.comments).slice(0, 5)
      }
    };

    return { allPosts, analytics };
  } catch (error) {
    console.error("Error analyzing social media data:", error);
    throw error;
  }
}

export { analyzeSocialMediaData, type Post };
