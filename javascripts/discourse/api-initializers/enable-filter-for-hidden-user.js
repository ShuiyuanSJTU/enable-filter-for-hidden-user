import { computed } from "@ember/object";
import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";

export default apiInitializer("1.8.0", (api) => {
  api.modifyClass("component:user-card-contents", {
    enoughPostsForFiltering: computed("topicPostCount", "post", function () {
      return true;
    }),

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
