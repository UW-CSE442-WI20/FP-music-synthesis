# Introduction to Music Synthesis

This tutorial introduces the basic theory and tools used to synthesize electronic instruments. View the website [here](https://uw-cse442-wi20.github.io/FP-music-synthesis/).

## Getting Started

This repo is set up to use the [Parcel](https://parceljs.org/) bundler. If you don't
like the way we've set things up, feel free to change it however you like!

The only restriction is that __your final HTML/CSS/JS output must be stored in the "docs" folder__ so that
GitHub knows how to serve it as a static site.

### Install

#### Required software

You must have Node.js installed. I prefer to install it using [nvm](https://github.com/nvm-sh/nvm)
because it doesn't require sudo and makes upgrades easier, but you can also just get it directly from
https://nodejs.org/en/.

#### Install dependencies

Once you've got `node`, run the command `npm install` in this project folder
and it will install all of the project-specific dependencies (if you're curious open up `package.json` to see where these are listed).

### Running the local dev server

To run the project locally, run `npm start` and it will be available at http://localhost:1234/.

### Building the final output

Run `npm run build` and all of your assets will be compiled and placed into the `docs/` folder. Note
that this command will overwrite the existing docs folder.
