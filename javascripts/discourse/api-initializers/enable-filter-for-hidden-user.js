import { computed } from "@ember/object";
import { apiInitializer } from "discourse/lib/api";
import I18n from "I18n";

export default apiInitializer("1.8.0", (api) => {
  api.modifyClass("component:user-card-contents", {
    pluginId: "enable-filter-for-hidden-user",
    avatarClicked: false,
    _show(username, target, event) {
      let isAvatarClick = false;
      if (this.avatarSelector) {
        isAvatarClick = !!event.target.closest(this.avatarSelector);
      }
      this.set("avatarClicked", isAvatarClick);
      return this._super(username, target, event);
    },

    // eslint-disable-next-line ember/require-computed-macros
    showFilter: computed("viewingTopic", "postStream.hasNoFilters", "avatarClicked", function() {
      return this.viewingTopic && this.postStream.hasNoFilters && this.avatarClicked;
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
