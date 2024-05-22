import { ConfigPlugin, withPlugins } from "@expo/config-plugins";
import { withEnabledFlag } from "./with-enabled-flag";
import { withPermissions } from "./with-permissions";

interface Props {
  enabled?: boolean;
}

export const withExpoChucker: ConfigPlugin<Props> = (config, { enabled }) => {
  return withPlugins(config, [
    [withEnabledFlag, { enabled: enabled ?? true }],
    withPermissions,
  ]);
};
