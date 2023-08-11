# AKPsi Brotherhood Access

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Notes for Maintenance (for non-developers and developers alike)
### Vue
#### Overview
This project is based in Vue, an open-source modern Javascript framework built on top of HTML, CSS, and Javascript. It allows for more efficient coding and more interactive, fast front-ends. It is a reactive framework, meaning it updates as the application's state changes, such as data changing. That makes it great for incorporating our database and ever-changing information in a clean and fast manner.

This web application is broken down into different parts. At a higher-level, there are different views. These are like different webpages, each with their own data, displays, styles, etc. For example, the Login Page is a view, and so is the User Dashboard. Encapsulated within these views are different components. The code for components looks similar to a view, but they are meant to be reusable instances incorporating Javascript methods, HTML, and CSS. There are many components for this website, such as the Login Form, the Navigation Bar, a Pie Chart, etc. All of these are reusable across the website without having to repeat code, keeping our code DRY. 

#### Maintaining Vue Code
As mentioned above, this website is broken down into parts, including Views and Components. It is unlikely the whole website would fail at once, but rather a specific View or Component. Read the error carefully, and find that specific View or Component that is afflicted. Review Vue 3 Documentation for assistance.

### Supabase
#### Overview
Supabase is an open-source database that AKPsi-Phi Brotherhood access operates on. Simply put, it stores all user data, charges, handles authentication, etc. Any data that needs to be stored is likely there. The interface is relatively simple to use, so if you are not a developer, you can simply use Supabase's UI. However, this may be slow, as you can't automate or quickly do a lot of tasks.
#### Maintaining Database
Supabase will pause the project after one week of inactivity (as of now, it may change). If no API calls are made within one week, you must manually go into Supabase to restart the database. Annoying. An automatic script to make a simple API call each week will be put in here soon, so you don't have to go in yourself, but you will have to set this up on your machine...
#### Handling Errors
Sometimes, Supabase may give you errors. Oftentimes, it is because the database has been paused. The database should be configured correctly, and the likely cause of other errors would be authentication access. See Supabase Docs for more information.

