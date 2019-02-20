# Project Title

Pulselive Front End Developer Test

### Installing

A step by step series of examples that tell you how to get a development env running

```
* Install node v10.15.1
* npm version 6.4.1
* Git clone the repository
* npm install
* Run 'gulp build:dev' in the terminal and the site should spin up, if not head to localhost:3000
```

Another gulp task added is watch. This task watch the scss files and es6 files. When developing if you save one of these files it will automatically update the correct folders in the 'public' folder and refresh the browser with your changes.

```
* Run 'gulp watch'
```

### Assumptions

* Used Vanilla JS
* Browsers - Chrome, Firefox, IE11
* Not responsive
* No tests required

### Given more time I would

* Use postCSS to use the autoprefixer
* Write unit tests
* Add image minification