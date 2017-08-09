const path = require('path');

module.exports = {
	entry: './src/kite.js',
	output: {
		filename: 'kite.js',
		path: path.resolve(__dirname, 'lib'),
		library: "Kite",
		libraryTarget: "umd",
		libraryExport: "default"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: /src/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.(html)$/,
				include: /src/,
				exclude: /node_modules/,
				use: {loader: 'html-loader'}
			},
			{
				test: /\.css$/,
				use: [
					{loader: "style-loader/useable"},
					{loader: "css-loader"}
				]
			}
		]
	},
};
