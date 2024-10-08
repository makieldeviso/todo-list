# Todo List
Todo List Web App

## About 
A Todo List App that can create events with tasks, and projects that can store events. Can track and filter schedule/ deadline of affairs and todo level of  priority.

## Objective
Implement a todo list web app with Object Oriented Programming paradigm. Refer to common principles of OOP as guides in organizing the code.

Build objects with focused/ single responsibility instead of multiple. Also, practice building the code base with separated concern between DOM manipulation and the application logic. 

Implement feature of saving data to localStorage to remember todo list in between page refresh.

## Features
The Todo List app mainly create events and projects, track said affair's schedule, categorize according to deadline and level of priority.

Current date is displayed on the header for user attention. Also, the user can edit their name for this web app.

Users can click the  **+ New Event** button to create a new event. Events information that can be added includes a title, description, schedule date, and event priority. The title and schedule are required to be filled. In addition, creating an event can either be a standalone event or an event linked for a project. This can be set with a provided dropdown menu. Task can be added for an event by entering the task in the input field then pressing the respective add task button to add task. In default, a task is added with a pending status. But in case the task was already completed, the user can click the checkbox to toggle the task's completion. Users can edit the task, else delete it. Pressing clear will reset the form, while pressing save will add the new event to memory of todo list.

Next, a **+ New Project** button is used to create a new todo project item. Creating a new project requires a title and the deadline date. A project description can also be added. The project priority level default is "mid" priority. The user can add from available events to add to the project. Pressing clear will reset the form, while pressing save will add the new project to memory of todo list.

Events can be accessed by clicking on Events category on the sidebar. Event items are arranged on a list type display with information laid-out on the list item. Clicking the event list item will expand the event information to a more pronounced view. If an event is part of a project, the project information serves as a link that can redirect the user to the project connected to this event. The user can edit and delete the event on this expanded view. Tasks can also be checked for completion in this panel. A **Complete Event** button is accessible for the user to click to complete the event. A dialog will open to remind the user for the task/s status for this event, the user can then confirm the event completion.

Projects can be accessed in a similar way to events. Clicking projects category will open the projects in a list and clicking project list item will expand project information. Events included in a project can be opened in this section. Completing a project requires all of the events for this project to be completed. Confirming project completion, updates the project todo item.

Meanwhile, other catagories filter todo items according to time constraints. First, *Today* filters todo items scheduled for the current date. Next, *Upcoming* tracks todo items scheduled within 7 days from the current date. Then, *Someday* track items currently not scheduled for today or passed deadline. Finally, **Overdue** prompts users of todo items passed their deadlines that have not yet been completed.

Todo items can also be viewed according to high, mid and low level of priorities.

## Live Preview
This project can be viewed at [Todo List](https://makieldeviso.github.io/todo-list/)