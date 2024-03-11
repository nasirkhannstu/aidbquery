import { type ThemeConfig } from "antd";

export const primary_color = "#1d39c4";

export const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: primary_color,
    colorInfo: primary_color,
    borderRadius: 4,
    colorBgContainer: "#f0f5ff",
    sizeStep: 4,
  },
  components: {
    Button: {
      defaultBorderColor: primary_color,
      defaultColor: primary_color,
    },
    Input: {
      colorBgContainer: "#f0f5ff",
    },
    InputNumber: {
      colorBgContainer: "#f0f5ff",
    },
  },
};
