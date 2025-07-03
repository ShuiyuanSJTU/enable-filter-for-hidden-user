import { h } from "virtual-dom";
import { apiInitializer } from "discourse/lib/api";
import { avatarFor } from "discourse/widgets/post";
import { i18n } from "discourse-i18n";

export default apiInitializer("1.8.0", (api) => {
  api.reopenWidget("posts-filtered-notice", {
    html(attrs) {
      const filters = attrs.streamFilters;
      if (filters.username_filters) {
        const filteredPostsCount = parseInt(attrs.filteredPostsCount, 10);
        let firstUserPost, userPostsCount;
        userPostsCount = filteredPostsCount;
        if (filteredPostsCount < 2) {
          firstUserPost = attrs.posts[0];
        } else {
          firstUserPost = attrs.posts[1];
          if (attrs.posts[1].user_id !== attrs.posts[0].user_id) {
            userPostsCount = filteredPostsCount - 1;
          }
        }
        return [
          h(
            "span.filtered-replies-viewing",
            i18n("post.filtered_replies.viewing_posts_by", {
              post_count: userPostsCount,
            })
          ),
          h(
            "span.filtered-avatar",
            avatarFor.call(this, "small", {
              template: firstUserPost.avatar_template,
              username: firstUserPost.username,
              url: firstUserPost.usernameUrl,
            })
          ),
          this.attach("poster-name", firstUserPost),
          this.attach("filter-show-all", attrs),
        ];
      }
      return this._super(attrs);
    },
  });
});
