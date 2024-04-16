Value: 20% of the Course Mark
Due: Monday 11th March (Week 5), 1pm
What is this Sprint aiming to achieve?

It’s time to actualise your designs into life. In Sprint 2, you’ll be building an MVP of your microservice/API. The learning outcomes of this Sprint can be broken down into three major pillars:

Iterating on the Design. You’ll have received feedback about your design from Sprint 1 - you will need to iterate and improve. You’ll also need to start going deeper into the detailed design by completing a data model for your application.

Building an MVP. Fast, good, cheap. Pick two. You only have two weeks to build the service. Start simple and build outwards, like a balloon. Get a basic “hello world” API working and deploy that. Then add in more functionality and keep iterating on your MVP. 

Mastering the Craft. Software Engineering is about so much more than just coding - writing clean code, testing, deploying, documenting and working as an Agile team. You’ll be building your skills in these areas that will help you in future Sprints and beyond.

Perfect is the enemy of good :slight_smile:. Pick the most important things and prioritise them!

1. Task :dark_sunglasses:
In this sprint, you will be expected to:

Revise your requirements list to include a series of non-functional requirements;

Finalise your Software Architecture Design and API Design;

Create a data model for your service;

Implement a first version of the service (MVP) using test-driven development; and

Deploy the service on the internet.

2. Non-Functional Requirements :checkered_flag:
In addition to the requirements you analysed in Sprint 1 from the initial service specification, you can start documenting your thoughts about the following considerations:

Security. Access to the service functionality of the API must be protected using an appropriate series of authentication and authorisation mechanisms. Document any relevant content inside a confluence page called Security.

Performance. The API endpoints should take a minimal amount of time to complete. In most cases this will be relatively straightforward. In some, where computations are more complex, you will need to spend time designing your algorithm with pseudocode to determine the algorithmic complexity and reduce it as much as possible. Document any relevant content inside a confluence page called Performance.

3. Software Architecture & API Design :construction_site:
Based on any feedback from your mentor on Sprint 1, along with any other changes you as a team wish to make, update your Software Architecture design as needed. You will need to produce a diagram of your updated design. There are some example formats provided in lectures; it simply needs to highlight the different layers at a high level, and roughly how they connect/interact with one another.

You will need to decide on your API Design, and complete the API Documentation using Swagger.

Update your Architecture and Interface pages as necessary, including providing a link or render of your Swagger documentation.

4. Data Modelling :diamond_shape_with_a_dot_inside:
In Sprint 1 you designed your service at a high level - choosing the components of the stack. Now, it is time to zoom in and focus on the initial design of the data model.

How you do this will depend on your chosen stack:

If you are using a relational database, you will need to produce an Entity Relationship Diagram;

If you are using Java / C# (or a similar Object-Oriented Programming framework) for the application layer, you will need to produce a UML Class Diagram;

If you are using a NoSQL database, you will need to produce the format in which your data is stored.

If your technical design doesn’t fit into any of these cases, try to determine what the corresponding data model should look like, and check with your mentor if you are on the right track.

The documentation will need to show how the data is stored (at the relevant level of abstraction), how it relates to one another and it should be clear how the application and persistence layers are interacting.

5. Development of the Service :tools:
5.1 General
Using the tickets you have specified in Sprint 1, build an MVP of the service. It does not need to be perfect - you may find that there is more than you as a team can complete in the 2 weeks. You may however find that you finish ahead of time and are able to complete more - this is fine as well. The different service categories will have different difficulties. If you find you and your team have time left, you may update your Requirements page and implement extra features of the API which provide value to the API client. 

5.2 Source and Version Control
Your mentor will send you a link to a GitHub Classroom repository which you and your team will use to host all your source code.

5.3 Code Quality
You will be marked on the quality of your code at a module / class / file / package level as well as the quality of the code itself. You should make logical design decisions, write robust code and adhere to Software Engineering design principles, including but not limited to the following:

DRY (Don’t Repeat Yourself);

KISS (Keep it Simple Stupid);

Using abstractions appropriately, including external libraries and modules; and

Adhering to language-specific conventions (e.g. “Pythonic”);

Correct casing of variable, function and class names;

Meaningful variable and function names;

Readability of code and use of whitespace; and

Modularisation and use of helper functions where needed.

5.4 Continuous Integration
You should setup an automated Continuous Integration system in your repository. The CI will need to include (but does by no means have to be limited to):

Automated running of your test suite;

Code linting;

Coverage checking;

Build checking, if your service is written in compiled / built code; and

(Optionally) Complexity checking, if such support exists for your language.

The CI should run on all Merge Requests / Pull Requests into the main branch of the repository.

5.5 Testing Practices
As part of implementing the service, you will need to use test-driven development. 

The layers of abstraction at which you write tests are up to you for the most part, however we require that you have tests which:

System tests which test the API endpoints;

Unit tests which test individual parts of the system working in isolation; and

Your tests provide over 85% coverage of the code in the repository. You are welcome to change this requirement as you see fit, however it must be justified.

5.6 Git Practices
You will be assessed on the following Git practices for development:

Commit messages are detailed and specific;

Avoid committing large chunks of code;

All merges into main/master are done via merge requests;

Code reviews are conducted, with evidence of comments in the MR/PR and approval by at least one other team member;

In most cases, One ticket = One branch = One merge request into main/master. 

5.7 Assumptions
As you design and implement the service, you will undoubtedly realise ambiguity in the specification and will need to make a series of assumptions. Document these in a Confluence page called Assumptions.

6. Deployment :rocket:
Students have the freedom to select any deployment provider of their choice that suit their project needs and preferences.

Update your Software Architecture diagram as needed.

7. Project Management & Communications :speech_balloon:
7.1 Scrum Communications
All team communications are as they were in Sprint 1;

As part of this sprint you will need to demonstrate your ability to communicate and work as a team. You will need to have:

A sprint planning meeting;

Regular standups, either synchronous or asynchronous (at least 3 a week); and

A sprint retrospective meeting.

You will need to take minutes for your meetings and record these on Confluence. Minutes should contain information on:

Who was there;

What was discussed; and

Action items.

Meeting minutes should also be taken at project check-ins.

You are welcome to use whatever asynchronous communication platform you as a team choose (MS Teams, Slack, Facebook, Discord) - however your tutor will setup a MS Teams Channel for you to communicate in, and this is the only place we will look when marking your communication and resolving disputes.

Inside a Confluence page called Communications, document any screenshots of communications outside MS Teams.

7.2 Task Tracking & Management
The Jira task board is your point of reference for managing the project. You will be marked on:

The board shows the truth of your team’s progress;

Tasks are updated, added to and adjusted as necessary as the project progresses;

8. Marking Criteria :check_mark:
Criteria

Description

Breadth & Depth of Implementation (35%)

This is a qualitative mark that your mentor will give based on how much of your service you have implemented, and the quality of what you have implemented. Considerations that are taken into account:

Complexity of functionality

Robustness of functionality (whether it is working)

Software Design & Architecture (30%)

Is the stack well designed and justified, and have any changes from Sprint 1 been documented and justified?

Have the non-functional requirements been accommodated and designed for?

Has a data model been produced which is accurate and demonstrates thoughtful planning?

Have the different layers been written and abstracted appropriately in the code? 

Does the API design provide a near-complete solution to the specified requirements?

Have all required fields been included for each endpoint?

Are the endpoint descriptions succinct and understandable?

Software Quality (20%)

Is there a suite of tests which gives a sufficient coverage score?

Are the tests well designed and thought out?

Has CI been setup to automatically check code in the repo?

Is the code well written and styled (See Section 5.3)

Deployment (5%)

Has the service been deployed on a platform?

Is it available and functional for anyone to use on the internet?

Project Management & Communications (10%)

Are meeting minutes well laid-out, detailed and insightful?

Has the team undertaken Agile communications? (standups, sprint planning, sprint retrospective)

Has the Jira board been used appropriately (See Section 7.2)

Have git commits and merge requests been used appropriately?

9. Submission :arrow_up:
Place a link to your repository inside a Confluence page called Codebase.

For this sprint, we will take the state of your Jira board, Confluence space and Git Repository at the deadline as your submission. You do not need to run any submission commands.

Late submissions will not be accepted.

Applications for Special Consideration and ELS assessment accomodations will not include extensions as this is a group project with no scope for extending deadlines. The course authority will determine an appropriate adjustment in cases where a Special Consideration request is approved or a student has an equitable learning plan. Students in either of these positions should email se2021@cse.unsw.edu.au.

10. Plagiarism :cross_mark:
The work you and your group submit must be your own work.

Students are permitted to use generative AI, provided they clearly disclose its use and seek confirmation from their mentor beforehand. This approach ensures transparency and responsible use of generative AI tools. 

Relevant scholarship authorities will be informed if students holding scholarships are involved in an incident of plagiarism or other misconduct.

You are welcome to seek help from other students taking the course, however all work you submit must be your own. The use of external contractors to complete the project or your part of the project is not permitted.

During your mentoring sessions, you mentor will be using the opportunity to interview you and ensure you are contributing to the project.
