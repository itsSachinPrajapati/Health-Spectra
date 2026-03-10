export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gradientFlow: {
          "0%": {
            backgroundPosition: "0% 50%",
            filter: "hue-rotate(0deg)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            filter: "hue-rotate(180deg)",
          },
          "100%": {
            backgroundPosition: "0% 50%",
            filter: "hue-rotate(360deg)",
          },
        },
      },
      animation: {
        gradientFlow: "gradientFlow 15s ease infinite",
      },
    },
  },
  plugins: [],
};
