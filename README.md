bnv-web
=======

Building the New Venture Calculators: Web interface and scoring engines


## Getting started

### Prerequisites

- [Node.js 6.x](https://nodejs.org/en/download/)
- [Sass 3.5+](http://sass-lang.com/install)
- A running [BNV API](https://github.com/polskycenter/bnv-web) instance

### Install

First, set environment parameters.

| Variable                | Description |
| :---------------------- | :------------- |
| `BNV__ENVIRONMENT`      | `production`, `test`, or `dev` |
| `BNV__HOST_API`         | The scheme and authority hosting the BNV web API |
| `BNV__HOST_CLIENT`      | The scheme and authority hosting the BNV web client |
| `BNV__SECRET`           | Cryptographically-strong string used to encrypt and sign cookies |
| `NODE_ENV`              | `production` or any other string; `production` squelches debug logging |

Next, clone the repository:

```sh
git clone git@github.com:polskycenter/bnv-web.git
```

Move into the repository and install dependencies:

```sh
cd bnv-web
npm install
```

Build &ndash; transpile, concatenate, and minify &ndash; CSS and JS assets:

```sh
npm run build
```

Finally, start the service:

```sh
node index
```


## About

### Definitions

**Action**

An `action` represents an activity or event which influences the outcome of a scenario (also called a "calculator"). For example, a scenario called "Raise venture capital" might have an action called "Create pitch deck".

**Importance**

Each `action` is assigned a level of importance within the scenario. Conceptually, `importance` informs the decision engine about how much the given `action` matters to the overall outcome. Different scoring engines may handle this weighting differently. For example, a scenario called "Raise venture capital" might have one action called "Create pitch deck" with an importance of "Medium" and another action called "Build and deploy working product" with an importance of "high".

**Evidence**

When running a calculator, the instructor or facilitator judges the performance of the entrepreneur(s) across each listed `action`. A better performance should earn a higher level of evidence and thus, a greater chance of success. Different scoring engines may handle this weighting differently though all must follow the "higher is better" requirement.

**Prior**

A `prior` represents the probability of success without any additional knowledge of entrepreneurial performance. A `prior` of `0.0` represents a very difficult task while a prior of `1.0` indicates certain success. That said, a scoring engine may place bounding rules on the output such that a score of 0% or 100% is impossible.


## Development

To start the web client in development mode, shell into the project directory and run:

```sh
npm run dev
```

### Notable third-party assets

[React](https://reactjs.org/) is the core JavaScript framework. [Tachyons](http://tachyons.io/) is used to style React components and DOM elements whenever possible. When not possible, CSS class names and SASS selectors are written using the [Block-Element-Modifier methodology](https://en.bem.info/methodology/naming-convention/). [Feather](https://feathericons.com/) is used for iconography. The output score gauge is generated with [Progressbar.js](https://kimmobrunfeldt.github.io/progressbar.js/).

### Debug

The [debug](https://www.npmjs.com/package/debug) module provides runtime logging. Omit the `DEBUG` environment variable to squelch all logging. Set `DEBUG` to the desired resource (e.g. `DEBUG=@polskycenter/bnv-web:[resource:...]`) to restrict logging to specific events. Or, use `DEBUG=*` to get all debug output from everywhere, including dependencies.

```sh
DEBUG=@polskycenter/bnv-web* node index
```

### Tests

To run all available tests:

```sh
npm test
```

### Versioning

This project follows [semantic versioning](http://semver.org/).

### Deployment

For process and log management, consider [PM2](http://pm2.keymetrics.io/).

### Contribute

PRs are welcome! PRs must pass tests prior to merge. For bugs, please include a failing test which passes when your PR is applied. To enable a git hook that runs `npm test` prior to pushing, `cd` into your repo and run:

```sh
touch .git/hooks/pre-push
chmod +x .git/hooks/pre-push
echo "npm test" > .git/hooks/pre-push
```
