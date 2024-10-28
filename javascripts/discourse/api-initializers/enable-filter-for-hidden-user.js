import { computed } from "@ember/object";
import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";

export default apiInitializer("1.8.0", (api) => {
  api.modifyClass("component:user-card-contents", {
    pluginId: "enable-filter-for-hidden-user",

    showFilter: computed(
      "viewingTopic",
      "postStream.hasNoFilters",
      "enoughPostsForFiltering",
      "username",
      "post.username",
      function () {
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
    ),

    filterPostsLabel: computed("username", "topicPostCount", function () {
      const username = this.username;
      const count = this.topicPostCount;
      if (!count) {
        return I18n.t(themePrefix("filter_all_posts"));
      } else {
        return I18n.t("topic.filter_to", { username, count });
      }
    }),
  });
});
