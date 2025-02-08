const nameModule = 'VGFiles';
const outputPaths = ['./dist'];

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = outputPaths.map(outputPath => {
	return (env, argv) => {
		let mode = argv.mode || 'development',
			name = nameModule.trim().toLowerCase();

		let args = {
			entry: './index.js',
			output: {
				path: path.resolve(__dirname, outputPath),
				filename: name + '.js',
				library: 'vg',
			},
			stats: {
				warnings: false
			},

			module: {
				rules: [
					{
						test: /\.js$/,
						use: 'babel-loader',
					},
					{
						test: /\.(scss|css)$/,
						use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
					}
				],
			},

			plugins: [
				new webpack.DefinePlugin({
					NODE_ENV: JSON.stringify(mode),
					LANG: JSON.stringify('ru'),
				}),
				new MiniCssExtractPlugin({
					filename: name + '.css',
				}),
			],
		};

		if (mode === 'development') {
			args.cache = false;
			args.devtool = 'inline-cheap-module-source-map';
			args.watch = true;
			args.watchOptions = {
				aggregateTimeout: 100
			}
		}

		if (mode === 'production') {
			args.devtool = 'source-map'
		}

		return args;
	}
});
