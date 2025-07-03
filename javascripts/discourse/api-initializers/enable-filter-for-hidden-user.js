import { h } from "virtual-dom";
import { apiInitializer } from "discourse/lib/api";
import discourseComputed from "discourse/lib/decorators";
import { withSilencedDeprecations } from "discourse/lib/deprecated";
import { avatarFor } from "discourse/widgets/post";
import { i18n } from "discourse-i18n";

export default apiInitializer("1.8.0", (api) => {
  withSilencedDeprecations("discourse.post-stream-widget-overrides", () =>
    widgetImplementation(api)
  );

  api.modifyClass(
    "component:user-card-contents",
    (Superclass) =>
      class extends Superclass {
        get showFilter() {
          // Only show filter button when viewing a topic
          if (!this.viewingTopic) {
            return false;
          }
          // When post owner is clicked, always show filter button.
          // For mention click, only show if enoughPostsForFiltering
          // this.post may be undefined when clicking on avatars in the topic summary
          const postOwnerClicked = this.username === this.post?.username;
          return (
            this.postStream.hasNoFilters &&
            (postOwnerClicked || this.enoughPostsForFiltering)
          );
        }

        @discourseComputed("username", "topicPostCount")
        filterPostsLabel(username, count) {
          if (!count) {
            return i18n(themePrefix("filter_all_posts"));
          } else {
            return i18n("topic.filter_to", { username, count });
          }
        }
      }
  );

  api.modifyClass(
    "component:post/filtered-notice",
    (Superclass) =>
      class extends Superclass {
        get firstUserPost() {
          return this.args.posts[1] ?? this.args.posts[0];
        }

        get userPostsCount() {
          let filteredPostsCount = parseInt(this.args.filteredPostsCount, 10);
          if (
            this.args.posts[1] &&
            this.args.posts[1].user_id !== this.args.posts[0].user_id
          ) {
            filteredPostsCount -= 1;
          }
          return filteredPostsCount;
        }
      }
  );
});

function widgetImplementation(api) {
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
}
