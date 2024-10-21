import { computed } from "@ember/object";
import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  api.modifyClass("component:user-card-contents", {
    enoughPostsForFiltering: computed("topicPostCount", "post", function () {
      if (this.post.post_number !== 1) {
        return true;
      } else {
        return this.topicPostCount >= 2;
      }
    }),

    filterPostsLabel: computed("username", "topicPostCount", function () {
      const username = this.username;
      const count = this.topicPostCount;

      // 自定义显示文案
      if (!count) {
        return I18n.t(themePrefix("filter_all_posts"));
      } else {
        return I18n.t("topic.filter_to", { username, count });
      }
    }),
  });
});
