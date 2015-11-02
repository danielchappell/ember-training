# Ember Training

A hands on guide to writting idomatic Ember.

##Contributions

This training guide and app was build and designed by Daniel Chappell and Kevin Boucher. Both this guide and the source code for the app are open source and completely free.

Please open an issue or submit a pull request for clairification or correction. Nothing is perfect with out help from the community, Thanks!

## Prerequesites and Dependencies

In this training we will build an app that has user creation, authentiation, other CRUD functionality, and all the validation you would expect from a robust user experience. We will be focusing most on Core architecture concepts in the eco system and applying them to build our app.

The primary motivation of this training is to demostrate the correct ember idoms for many non trival (however common) application concerns. **It is expected that you have throughly read the [Ember Guide](http://guides.emberjs.com/v2.1.0)** at least the sections covering these topics as we will not dedicate time to introduce syntax:

* Ember Object Model
* Routing
* Templates
* Components
* Controllers
* Models

## Dependancies

Our app will utilize ember-cli which has the following depedencies:
* [Phantom JS](phantomjs.org)
* [Node.js](nodejs.org) (with NPM) >= .10
* [bower](bower.io)

Please also download:
* [Ember Inspector](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)

##Getting Started

Welome! We are going to build an ember app that uses many of the core concepts of ember.

First clone this repo it has the CSS and package.json/bower.json you will start out with.

```bash
$ git clone https://github.com/josephchappell/ember-training.git
```

If you haven't yet globally install ember-cli. Like this:

```bash
$ npm install -g ember-cli
```

Now lets navigate to the ember-training repository. If you list the files you should see a package.json and a bower.json. The package.json lists dependencies and versions that are controlled by NPM package manager. The bower.json file does the same but for dependencies that are controlled by bower.

These are the two package managers an ember app will use. When you clone down a repo you do not yet have the dependencies as they are not generally tracked by git. To download all the dependencies from npm and bower:

```bash
$ npm install
$ bower install
```

## The App - A Calculator

Our app is a touch/click driven cacluator. It has advanced features such as not allowing you to press the wrong button, a generated printout of your entered operations (like old register tape), and the ability to save your registers. You will also be able to go back and review your old register where you can potentially delete them potentially delete them! Obviously since we are saving our calcuations to a database we have to have discrete user sessions so only see our own regisers. Did I mention also more validation than you can shake a stick at?

### The API

The API for these operations is provided as we will just be focusing on the ember code base.

**Namespace**
https://ember-calc.herokuapp.com/api/v1

/checkAuth GET (Checks cookie returns 200 or 401)

/login POST   (200 + cookie or 401)
{
username: String,
password: String
}

/logout POST
No request body

/users POST
{
username: String,
password: String
}

/registers GET
/registers POST
/registers/:id GET
/registers/:id DELETE

## Design and Mockups

All of the required CSS is already included in the app. (Credit [Kevin Boucher](https://github.com/kboucher)) The HTML to go along with it will be provided in each section as we expand on our app. Even though all that work is done for us, It is still good to get a mental picture of our end product.

First the user must be able to login and logout. This will also be the first page a user lands on when not yet authenticated:

![Sign In Page](https://s3.amazonaws.com/ember-trainings/ember-trainings/sign_in.png)

They must also be able to Sign up:

![Sign Up Page](https://s3.amazonaws.com/ember-trainings/ember-trainings/sign_up.png)

Pretty easy so far. Signing up successfully should automatically sign them in. Also authenticated pages will have a logout button as you will see momentarily.


The Main Calculator View:

![The Main Calculator View](https://s3.amazonaws.com/ember-trainings/ember-trainings/+calculator-plain.png)

This will be the main page of our app where we use the calculator and experience the magic that is digital register tape. On the right side of the screen we see a 'saved registers header' Here is where all our saved regisers will be displayed in a list for individual viewing.

Ok I think that is enough for now The rest of the features I will show as we get to them.

The best place for us to start is the calculator itself. All the actual non trival thinking will take place here. I have done the thinking for you and will be providing the implementation so we can focus on where the code snippets should go.

Again I want to reiterate the focus of this training is how to put different types of code together correctly in ember, It is very possible you are able to create a better or more clever solution than me for the calculator logic its self!.

![calculator closup](https://s3.amazonaws.com/ember-trainings/ember-trainings/+calc_closeup.png)

Ok lets start..

## The Calculator

The main authenticated page in our app will be the one that shows the calculator. To me it made since to make this the /calculator route. However you could have named it /johnlockeisalive or something else even less semantic. We must first create this route in the file system before we can start writing code to make it work.
