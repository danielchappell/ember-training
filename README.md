# Ember Training

A hands on guide to writting idomatic Ember.

##Contributions

This training guide and app was build and designed by Daniel Chappell and Kevin Boucher. Both this guide and the source code for the app are open source and completely free.

Please open an issue or submit a pull request for clarification or correction. Nothing is perfect with out help from the community, Thanks!

## Prerequesites

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

## Getting Started

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

Ember-CLI (in the terminal/command-line) will be your tool for creating your files in the proper place. Here is the command (Also make sure you are inside your project director):

```bash
$ ember generate route calculator
```

You should see something like this:

![ember generate route img](https://s3.amazonaws.com/ember-trainings/ember-trainings/ember+generate+route.png)

As we see above adding a route also adds a template file of the same name, along with a ready to go test file (Yay!).

Along with the newly created files, Ember also changed your app/router.js file, which is The Ember Router not to be confused with an Ember.Route.

Here is what yours and any other new ember-cli project's router.js should look like:

```javascript
import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
});

export default Router;
```

After the route generation command was run it now has one line added.

```javascript
import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.route('calculator');
});

export default Router;
```


```javascript
this.route('calculator')
```

decares the calulator route for use in app, and will load the corresponding calculator route (Ember.Route) when it is visited which by default will be /calculator.

you can also change the default path of a route like this (but please don't at this point):


```javascript
this.route('calculator', {path: '/johnlockeisalive'})
```

## The Calculator Controller

Now generate a controller for our calculator route

```javascript
$ ember generate controller calculator
```

The controller in ember is very much like a component and should be thought of as the top level component for a given route. One of major differences between controllers and components, is that controllers are singleton which have one instance used throught the app session, where components are more reusable and a new component instance is created each place they are used.

A controller therefore is the context for template the route will load (in our case the calculator template). the controller should contain all logic too specific to go into the model. The best example of this is properties and functions that control screen state. Which is exactly what drives our calculator!

##### Important Digression

It is important to note that every route(navigatable area) in ember will have

* An Ember.Route
* An Ember.Controller

But you do not have to define either of these files unless you need them. If they are not defined in your codebase, ember will create the default route or controller on the fly. Which is one of the first benefits of ember. ** Idomatic Ember solutions require less code**.

In our case we need to add much calculator specfic logic to the controller, so we have generated one.

##### End of Digression


## The Template file

Navigate to your calculator.hbs file and lets fill it with some boilerplate html that is our calculator structure.

```handlebars
<div class="row section calculator-wrapper">
    <div class="col s12 m6 offset-m1">
        <div class="calculator-container z-depth-1">
            <div class="row">
                <div class="col s12">
                    <!--the register info will go here -->
                </div>
            </div>
            <div class="row">
                <div class="col s12">
                    <div class="screen blue-grey darken-4 white-text right-align">
                        <!--the display info will go here -->
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s9">
                    <div class="custom-container row">
                        <div class="col s3">
                            <button class="btn-flat waves-effect waves-light">x<sup>y</sup></button>
                        </div>
                        <div class="col s3">
                            <button class="btn-flat waves-effect waves-light"> !</button>
                        </div>
                        <div class="col s3">
                            <button class="btn-flat waves-effect waves-light">sin</button>
                        </div>
                        <div class="col s3">
                            <button class="btn-flat waves-effect waves-light">cos</button>
                        </div>
                    </div>
                    <div class="number-container">
                        <div class="row">
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">7</button>
                            </div>
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">8</button>
                            </div>
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">9</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">4</button>
                            </div>
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">5</button>
                            </div>
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">6</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">1</button>
                            </div>
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">2</button>
                            </div>
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">3</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">.</button>
                            </div>
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">0</button>
                            </div>
                            <div class="col s4">
                                <button class="btn-flat waves-effect waves-light">=</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col s3">
                    <div class="function-container">
                        <div class="row">
                            <div class="col s12">
                                <button class="btn-flat btn-clear waves-effect waves-light">Clear</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12">
                                <button class="btn-flat waves-effect waves-light">÷</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12">
                                <button class="btn-flat waves-effect waves-light">×</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12">
                                <button class="btn-flat waves-effect waves-light">-</button>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col s12">
                                <button class="btn-flat waves-effect waves-light">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col s12 m4">
    <!-- saved registers will eventually go here -->
    </div>
</div>
```

Ok I know there is alot there, but it is just buttons and wrapper divs! We are using [Materialize CSS](http://materializecss.com/) which you might have seen in the bower.json file. All the classes extra classes are part of materialize. We could work hard to build something ugly, but how would we feel once done? Exactly.

You should be seeing something that looks like this:

![basic calc structure](https://s3.amazonaws.com/ember-trainings/ember-trainings/calculator_basic_markup.png)

You probably noticed this is just plain HTML there is no handlebars or ember functionality in this template yet. That is because we don't have any Ember logic written yet! Lets go do that now, Our routes template takes it's values directly from controller of the same name so lets go there now.

### Back to the Controller!


Generate files start as just empty exports, but these exports extend the correct parent class. Your starting calculator controller should look like this:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
});
```

Lets use the concepts you learned in [Ember Guides - Object Model](http://guides.emberjs.com/v2.1.0/object-model/computed-properties/) to start filling in our logic.

We know we will need a display property which will hold the current value of the screen, and we also probably need a property to hold whatever the current total is:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  display: '',
  runningTotal: ''
});
```

### adding button actions

In Ember 'actions' are used to handle user input in a safe way with out having to manually add observers, actions can be defined on the controller, route, or any component. Lets add some actions will fire when our calculator buttons are pressed.

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  display: '',
  runningTotal: '',
  actions: {
    inputNum(num) {
      //implement
    },
    inputOperator(fnName) {
      //implement
    }
  }
});
```

It seems like a good idea to have one actions for all number inputs and another that handles operations. You could also handle all the input with one action, or handle each button with a different action. One action seemed too complicated, and was becoming a parsing algorithm, and with an action for each button there is alot of duplicated code that can be easily avoided, However you could do it a variety of ways.

### Pause for more requirements!

Our calculator has 8 functions.
*5 are infix style functions that take two operands
* + Addition
* - Subtraction
* x Multiplication
* / Division
* x^y x to the power of y

and 3 unary functions which will operate on the current total:

* ! factorial
* sin calculates the sine of a number
* cos calculates the cosine of a number

### unpause

We need a way to handle both functions that operate on one value and also functions that operate on two. Also we need a way to accept number or decimal input and know whether to add it to the left or the right operator. I'm jumping ahead a bit but, Here is what I came up with:

```javascript
import Ember from 'ember';

export default Ember.Controller.extend({
  display: '',
  runningTotal: '0',
  operand: '',
  loadedFn: null,
  actions: {
    inputNum(num) {
      let runningTotal = this.get('runningTotal');
      let operand = this.get('operand');
      let loadedFn = this.get('loadedFn');

      if (operand && operand !== '0' && loadedFn) {
          this.set('operand', this.get('operand').concat(num));
         } else if(loadedFn) {
            this.set('operand', num);
         } else if (runningTotal === '0') {
            this.set('runningTotal', num);
         } else {
            this.set('runningTotal', this.get('runningTotal').concat(num));
         }
    },
    inputOperator(fnName) {
      let {loadedFn,
          operand,
          runningTotal} = this.getProperties(['loadedFn', 'operand', 'runningTotal']);

            if (loadedFn) {
                runningTotal = loadedFn(+operand);
                this.setProperties({runningTotal,
                                    loadedFn: null,
                                    fnName: null,
                                    operand: ''
                                   });
            }

            this.send(fnName, +runningTotal);
    }
  }
});
```
There is alot to explain here:

1. I decided to used curried functions (not written yet) for the math operations. The infix functions will store a preloaded function that takes the final arugment in the 'loadeFn' property.

2. 'runningTotal' will be a string (for concatentation purposes) then converted to an number to be used as the left operand or single operand depending on the function.

3. The 'operand' property default as an empty string but is built (by concatentation) to be the second operand for infix functions.

4. I know to add the a number character to the runningTotal (first operand) if there is not currently a loadedFn (a pending infix operation) otherwise I should be adding the number to the 'operand' (second operand).

5. When a new operation is input and there is already a loadedFn run the loadedFn with the current operand property.

6. Take the updated runningTotal and send it as the argument to the specific action for a given operation. (not written yet)


Ok, this will eventually make sense... lets add the actions helpers to our template file and send each action the proper argument:


```handlebars
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "powerOf"}}>x<sup>y</sup></button>
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "factorial"}}> !</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "cos"}}>cos</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "sin"}}>sin</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "7"}}>7</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "8"}}>8</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "9"}}>9</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "4"}}>4</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "5"}}>5</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "6"}}>6</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "1"}}>1</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "2"}}>2</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "3"}}>3</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "."}}>.</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputNum" "0"}}>0</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "equal"}}>=</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "divide"}}>÷</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "multiply"}}>×</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "subtract"}}>-</button>
    <button class="btn-flat waves-effect waves-light" {{action "inputOperator" "add"}}>+</button>
```

I removed all the extra divs from the example just find each button and update it accordingly. The action helper takes the action name as a string and then how many ever arguments our function takes. I am passing the numbers and function names as strings.

If you reference the functions in the javascript example above I am concatentating each number digit to build input together like '234' would be '2' '3' '4'. I know that as long as there is not an infix function loaded, any number pressed should be concatentated onto the runningTotal.

### math utility functions

Ember suggests that we organize our our utility files into the app/utils/ directory. Ember doesn't need the utility files in a certain place, since they are not looked up by the resolver, this is just a helpful convention, so all ember apps can look the same. In fact there is a a built in ember-cli generator for utility files. Lets go ahead a make our calculator function utility file.

```bash
$ ember generate util calc-funcs
```

ok now nagivate to app/utils/calc-funcs.js and paste in these functions, you should erase what is already there:

```javascript
/**
Curried versions of simple math operations
 **/

export function add(num1) {
    return (num2) => num1 + num2;
}

export function subtract(num1) {
    return (num2) => num1 - num2;
}

export function multiply(num1) {
    return (num2) => num1 * num2;
}

export function divide(num1) {
    return (num2) => num1 / num2;
}

export function factorial(num, acc = 1) {
    if (num <= 1) {
        return acc;
    }
    return factorial(num - 1, num * acc);
}

export function toPower(num1) {
    return (num2) => Math.pow(num1, num2);
}
```

If you need to brush up on ES6 module syntax, here is a good link for that [ES6 Modules](http://exploringjs.com/es6/ch_modules.html)

You should now import these functions into your calculator controller. Like this:

```javascript
import * as Calc from '../utils/calc-funcs';
```

This brings all exported functions from the calc-funcs file in under the Calc namespace. We now access the factorial function as Calc.factorial(num). You can also import them individually, but I will have other functions with similar names so I found it best to import them namespaced.

Notice the functions above for the infix operators are curried and when they are exectuted with 'runningTotal' they will return what will be stored in the 'loadedFn' property. Lets do that part now.


```javascript
import Ember from 'ember';
import * as Calc from '../utils/calc-funcs';

export default Ember.Controller.extend({
  display: '',
  runningTotal: '0',
  operand: '',
  loadedFn: null,
  fnName: null,
  currentTotalFreeze: false,
  _updateAndPrintRunningTotal(newRunningTotal) {
        this.setProperties({runningTotal: newRunningTotal,
                            currentTotalFrozen: true,
                            });
  },
  actions: {
    add(runningTotal) {
        this.setProperties({loadedFn: Calc.add(runningTotal),
                            fnName: 'add'});
    },
    subtract(runningTotal) {
       this.setProperties({loadedFn: Calc.subtract(runningTotal),
                           fnName: 'subtract'});
    },
    multiply(runningTotal) {
      this.setProperties({loadedFn: Calc.multiply(runningTotal),
                          fnName: 'multiply'});
    },
    divide(runningTotal) {
      this.setProperties({loadedFn: Calc.divide(runningTotal),
                          fnName: 'divide'});
    },
    powerOf(runningTotal) {
      this.setProperties({loadedFn: Calc.powerOf(runningTotal),
                          fnName: 'powerOf'});
    },
    factorial(runningTotal) {
      this._updateAndPrintRunningTotal(Calc.factorial(runningTotal));
    },
    sin(runningTotal) {
      this._updateAndPrintRunningTotal(Math.sin(runningTotal));
    },
    cos(runningTotal) {
      this._updateAndPrintRunningTotal(Math.cos(runningTotal));
    },
    equal(runningTotal) {
      this._updateAndPrintRunningTotal(runningTotal);
    },
    inputNum(num) {
      let runningTotal = this.get('runningTotal');
      let operand = this.get('operand');
      let loadedFn = this.get('loadedFn');

      if (operand && operand !== '0' && loadedFn) {
          this.set('operand', this.get('operand').concat(num));
         } else if(loadedFn) {
            this.set('operand', num);
         } else if (runningTotal === '0') {
            this.set('runningTotal', num);
         } else {
            this.set('runningTotal', this.get('runningTotal').concat(num));
         }
    },
    inputOperator(fnName) {
      let {loadedFn,
          operand,
          runningTotal} = this.getProperties(['loadedFn', 'operand', 'runningTotal']);

            if (loadedFn) {
                runningTotal = loadedFn(+operand);
                this.setProperties({runningTotal,
                                    loadedFn: null,
                                    fnName: null,
                                    operand: ''
                                   });
            }
            this.set('currentTotalFreeze', false);
            this.send(fnName, +runningTotal);
    }
  }
});
```

A specfic  action for each operator has been added. Now our previous line in inputOperator makes sense:

```javascript
this.send(fnName, +runningTotal);
```

We do the specific general logic needed for any operator in the inputOperator action and then call the operator specific action, by the operator name that is passed, where we do the logic specific to that operator. Here is where we will make the nessary distinction between infix fuctions and unary operations. **This highlights a strength of the ember action invocation syntax. Functions are called with a string name, enabling more easy meta-programming.**

There is a new property 'currentTotalFrozen' that is false by default. This property serves one purpose: Preventing numbers from being entered. After an operation that totals without adding a new funtion, So equals or any unary function(which auto total like equals). If one of these functions are input, you must either clear your total to start over or carry the total forward by selected another operator. This prevents you from adding a number as another to the end of currentTotal (which would not be intended).

I have also added another function (a regular method, not action) _updateAndPrintRunningTotal. This is the function that is called by unary functions to immediately update the running total and (eventually we will print to the register).

The infix functions how ever delay their calculation and updates until either:

1. The total is requested with =
2. Another operator is input, and the current loadedFn has not been evaluated. (In this state we will have our runningTotal our loadedFn and our complete operand, so it is a good time to calculate.)

You might have also notice for every infix function that gets set into 'loadedFn' I am saving the string name of that type of function in a property 'fnName'. Right now there isn't a reason to do that. But I have a plan for it and will return to explain this part in a later section, for now lets let it hang out.


### Clear button

We only have one button left to handle the clear button! Lets add an actions for it:

Add this to your actions hash in the controller:

```javascript
clearDisplay() {
  this.setProperties({
    runningTotal: '0',
    loadedFn: null,
    fnName: null,
    operand: '',
    currentTotalFrozen: false
  });
}
```

For now clearDisplay is going to be pretty simple and just reset all our state properties that drive the calculator. Lets add our actio helper to the clear button in the template:

```handlebars
    <button class="btn-flat btn-clear waves-effect waves-light" {{action "clearDisplay"}}>Clear</button>
```

Sweet!

### weren't we going to display something...

Oh yeah, I guess we should do something with that display property we declared as null right at the start. Find you code that looks like this in calculator.hbs

```handlebars
<div class="screen blue-grey darken-4 white-text right-align">
    <!--the display info will go here -->
</div>
```
And replace the comment. It should look like this:

```handlebars
<div class="screen blue-grey darken-4 white-text right-align">
    {{display}}
</div>
```
However in all our calculations we haven't ever set display and it is still null, which obviously won't work. That's ok! Turns out there is a better option here than mutative state. If you take out your pocket calculator (aka  your phone) you will probably see that either the left operand is displaying or the right operand is displaying, depending if we have loaded an infix function or not (really it depends on if you have started building the second operand).

Ok so in our app we will only show either the runningTotal or the second number('operand') The operand will only ever be present if we are in an infix function and at least one number has been pressed to build the 'operand' property. So that is perfect. This is an opportunity for a pure calculation. AKA Computed Property. Replace the display: null on our controller with this code:

```javascript
display: Ember.computed('runningTotal', 'operand', function() {
    return this.get('operand') || this.get('runningTotal');
})
```
Computed properties are pure functions that return a calculation that is based on their dependent keys which you can think of as the arguments for the function. Computed properties are very efficient as they are able to cache their values, and only clear the cache when one of their dependent keys change in some way.

There are also built in computed properties, that add alot of functionality in a single line, we are about to use some of those now.

### Indicating the current operation

We need a way to know if we are current inputing the second number for addition or division. You know we don't have great memories, and we aren't showing the operator symbol in the display, Why? Because the apple calculator didn't! Anyway lets write some computed properties and template code to have the current function button highlighted:

```javascript
isAdding: Ember.computed.equal('fnName', 'add'),
isSubtracting: Ember.computed.equal('fnName', 'subtract'),
isDividing: Ember.computed.equal('fnName', 'divide'),
isMultiplying: Ember.computed.equal('fnName', 'multiply'),
isPowerOfing: Ember.computed.equal('fnName', 'powerOf'),
```

Now our fnName is coming in handy. We now have some easy to use declaritive properties that will automatically update true/false when fnName changes.

```handlebars
<button class="btn-flat waves-effect waves-light {{if isPowerOfing "active"}}" {{action "inputOperator" "powerOf"}}>x<sup>y</sup></button>
<button class="btn-flat waves-effect waves-light {{if isDividing "active"}}" {{action "inputOperator" "divide"}}>÷</button>
<button class="btn-flat waves-effect waves-light {{if isMultiplying "active"}}" {{action "inputOperator" "multiply"}}>×</button>
<button class="btn-flat waves-effect waves-light {{if isSubtracting "active"}}" {{action "inputOperator" "subtract"}}>-</button>
<button class="btn-flat waves-effect waves-light {{if isAdding "active"}}" {{action "inputOperator" "add"}}>+</button>
```
Now which ever function is currently active (based on fnName) will have the 'active' class which has visual indication to the user. Man this is really comming together. We should take this visual indication thing a step further and prevent the user from pushing buttons that will break our app. For example two infix functions in a row, or a function and then equals, or equals and then a number..ah crap. There are lots of bugs with out validation!

lets create more computed properties to know what state our app is in.

Here are the computed properties that will tell us whether a number can currently be input, add these to your controller:

```javascript
cannotInputNumber: Ember.computed.readOnly('currentTotalFrozen'),
canInputNumber: Ember.computed.not('cannotInputNumber')
```
We can pretty much enter a number at any time unless we have totaled out and need to clear, which we can know based on the currentTotalFrozen property. If that property is true, we cannot input a number. I also have the inverse computed property for conveience. which is the ember.computed.not of its opposite property.

Lets do the same for operators:

```javascript
hasLoadedFunction: Ember.computed.bool('loadedFn'),
cannotInputOperator: Ember.computed('hasLoadedFunction', 'operand', function() {
    return this.get('hasLoadedFunction') && !this.get('operand');
}),
canInputOperator: Ember.computed.not('cannotInputNumber'),
cannotInputEqualOperator: Ember.computed.or('cannotInputOperator', 'currentTotalFrozen')
```

Here we have a ember.computed.bool which converts the 'loadedFn' to a booleans (functions always evaluate to true), we use this to know if we can input an operator. The only time we cannot input an operator is if we have a loadedFn but we do not yet have an operand (second number). The code above in cannotInputOperator watches both hasLoadedFunction and operand to determine when this is true.

Additionally with the equal operator we cannot use it, if a total has already been calculated which is indicated by the 'currentTotalFrozen' property. Here we use an ember.computed.or to return true if either condition/property is true. These logical computed properties are very helpful Ember provides a number of them:

* Ember.computed.and('prop1', 'prop2', 'prop3',...)
* Ember.computed.or('prop1', 'prop2', 'prop3',...)
* Ember.computed.bool('prop1')
* Ember.computed.not('prop1')
* You can use Ember.readOnly('prop1') if prop1 is already a boolean.

Lets update the template to disable the buttons when their operation is not allowed:

```handlebars
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputOperator}} {{action "inputOperator" "powerOf"}}>x<sup>y</sup></button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputOperator}} {{action "inputOperator" "factorial"}}>!</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputOperator}} {{action "inputOperator" "cos"}}>cos</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputOperator}} {{action "inputOperator" "sin"}}>sin</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "7"}}>7</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "8"}}>8</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "9"}}>9</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "4"}}>4</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "5"}}>5</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "6"}}>6</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "1"}}>1</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "2"}}>2</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "3"}}>3</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "."}}>.</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputNumber}} {{action "inputNum" "0"}}>0</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputEqualOperator}} {{action "inputOperator" "equal"}}>=</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputOperator}} {{action "inputOperator" "divide"}}>÷</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputOperator}} {{action "inputOperator" "multiply"}}>×</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputOperator}} {{action "inputOperator" "subtract"}}>-</button>
    <button class="btn-flat waves-effect waves-light" disabled={{cannotInputOperator}} {{action "inputOperator" "add"}}>+</button>
```

Ok now the computed properties will autmatically controller the disabled attribute on our html buttons. We are winning!

### Adding the printing functionality

So far I have been ignoring the register part of the calculator that prints a ledger/register as we go. Most all of the code to add this functionality will be added to methods we have already written, lets get it working so we can move on. No great ember lessons here, just select places we all the set the registerTape property with a new concatenation to add the next line.

First declare the property:

```javascript
registerTape: ''
```

now update this method:

```javascript
_updateAndPrintRunningTotal(newRunningTotal) {
    this.setProperties({runningTotal: newRunningTotal,
        currentTotalFrozen: true,
        registerTape: this.get('registerTape').concat(`\n----------- \n${newRunningTotal}  \n`)
    });
}
```

and this method:

```javascript
inputOperator(fnName) {
    let {loadedFn,
        operand,
        runningTotal,
    registerTape} = this.getProperties(['loadedFn', 'operand', 'runningTotal', 'registerTape']);
    //Only the first register line will use runningTotal
    //If fn is = after a unary operator don't print a value;
    let registerPrintValue = operand || fnName !== 'equal' && runningTotal || '';

    if (loadedFn) {
    runningTotal = loadedFn(+operand);

    this.setProperties({runningTotal,
        loadedFn: null,
        fnName: null,
        operand: ''
        });
    }

    this.setProperties({registerTape: registerTape.concat(`\n${registerPrintValue} ${this._getOperatorSymbol(fnName)}`),
    currentTotalFrozen: false
    });

    this.send(fnName, +runningTotal);
    }
```

These are the two methods where we print to the register. The first method for 'equals' and other unary operators, and the second method prints something every time. Don't forget to add the registerPrintValue assignment expression in the inputOperator method!
