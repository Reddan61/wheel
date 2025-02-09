const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  mode: "development",
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      src: path.resolve(__dirname, "src"),
      assets: path.resolve(__dirname, "public", "assets"),
    },
  },
  devServer: {
    compress: true,
    port: 8080,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: ["ts-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|obj|gltf)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets",
            },
          },
        ],
      },
    ],
  },
};
