Since April, you have helped me with a number of projects that involve using CtsUrns for working with passages of text and Cite2Urns for working with data-objects in collection; these have often been serialized according to the CEX standard. Some projects we have worked on together are:

- <https://github.com/Eumaeus/Dramaturg.jl>
- <https://github.com/Eumaeus/MorphologyDocumenter>
- <https://github.com/Eumaeus/Syntactile>
- <https://github.com/Eumaeus/SyntactileViz>

Many of these are updated versions of older projects that I wrote in languages like Groovy, Scala. For Groovy and Scala, my collaborator and I wrote complete libraries for working with CtsUrns, Cite2Urns, and the other parts of what we call the "CITE Architecture". As my work moved to Julia and increasingly to Javascript, I have not reproduced such a code library. I would like to do so now, to make future projects easier.

I would like to start with Javascript, taking an object-oriented approach. I value Javascript for its ubiquity and its low overhead, which is why I try to avoid using frameworks like Node.js or jQuery.

I have started a repository at: <https://github.com/Eumaeus/cite-architecture.js>.

In it are:

- A directory `ai_queries` that will contain a record of our correspondance going forward, so we always have the complete context.
- A skeletal `README.md` file.
- Javascript code for a `CtsUrn` class, with properties and methods: `js/ctsurn.js`.
- A separate file of JS tests for the `CtsUrn` class: `js/test-ctsurn.js`.
- An HTML file to go with the tests: `test-cts.html`. Some css to go with it at `css/style.css`.
- A skeletal description of the CITE Architecture's APIs, as I envision them for this JS project.

The code in `js/ctsurn.js` is my own work, and the tests in `js/test-ctsurn.js` is in my not-very-elegant made up test framework. I've looked at JS test frameworks, but the crazy overhead invariably involved—a million Node.js packages and dependencies—has always seemed more trouble than it is worth. 

I would like to start the process of filling this project out, with your help.

We can be methodical and gradual.

## Two First Specific Steps

1. A Code-review of `js/ctsurn.js` and `js/test-ctsurn.js`. I wrote those without outside help mainly because I wanted to get my thinking back in the "CtsUrn Space". I would welcome advice, from catching errors to a complete rewrite. If there is a straightforward way to translate my tests in `js/test-ctsurn.js` into a more professional format, without a lot of external dependencies and lavish frameworks, I would happily upgrade those tests.
2. Filling in the CtsUrn-part of `apis.md`. Once you have read the code in `js/ctsurn.js`, I would be grateful for help in translating those to concise technical descriptions. In `apis.md`, at lines 50 and 54 in the version currently in the repository, are:

`[ TBD Description of CtsUrn properties here. ]`

…and…

`[ TBD Description of CtsUrn methods here. ]`

I'd love so see what you might suggest for those two slots!

Is this a project you can help with?

---




