import { heroui } from "@heroui/theme";
import { colors } from "@heroui/theme";

export default heroui({
  themes: {
    dark: {
      extend: "dark",
      colors: {
        primary: colors.blue,
      },
    },
  },
});
