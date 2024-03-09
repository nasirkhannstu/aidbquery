import { type ThemeConfig } from "antd";

export const primary_color = "#1d39c4";

export const theme: ThemeConfig = {
  token: {
    fontSize: 16,
    colorPrimary: "#1d39c4",
    colorInfo: "#1d39c4",
    borderRadius: 4,
    colorBgContainer: "#f0f5ff",
    sizeStep: 4,
  },
  components: {
    Input: {
      colorBgContainer: "#f0f5ff",
    },
    InputNumber: {
      colorBgContainer: "#f0f5ff",
    },
  },
};
