import { apiInitializer } from "discourse/lib/api";
import { computed } from "@ember/object";

export default apiInitializer("1.8.0", (api) => {
  console.log("enable_newfilter: hello world from api initializer!");
  console.log("Theme Prefix:", themePrefix());
  console.log("Debug Translation:", I18n.t(themePrefix("debug")));
  api.modifyClass("component:user-card-contents", {
    get enoughPostsForFiltering() {
      return true;
    },

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